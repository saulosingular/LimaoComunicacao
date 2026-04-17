'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import { useOrcamento, IOrcamentoStatusOption } from '@/hooks/useOrcamento';
import { IOrcamentoDTO } from '@/shared/interfaces/orcamento';
import { FiTrello, FiCalendar, FiDollarSign, FiMove, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import {
    KanbanContainer, BoardHeader, Title, BoardScrollArea,
    ColumnContainer, ColumnHeader, ColumnBody,
    OSCard, CardHeader, CardTitle, CardMetrics
} from './styles';

// DnD Kit Imports
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Subcomponent: Cartão Arrastável (OS Item) ---
function SortableOSCard({ os, activeDragId }: { os: IOrcamentoDTO; activeDragId: string | null }) {
    const navigate = useNavigate();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: os.id, data: { status: os.status } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Previne render pesado do item original quando ele deixa uma sombra pra tras no overlay
    if (isDragging && activeDragId === os.id) {
        return <OSCard ref={setNodeRef} style={style} $isDragging={true} />;
    }

    return (
        <OSCard ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="os-number">#{os.numeroOs || '?'}</div>
                    {os.versaoOs && (
                        <div style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            Rev {os.versaoOs}
                        </div>
                    )}
                </div>
                <div className="os-date"><FiCalendar /> {os.dataCriacao.split('-').reverse().join('/')}</div>
            </CardHeader>
            <div onPointerDown={(e) => {
                // Impede que o clique inicie navegação instantânea antes do drag-and-drop verificar se houve arraste
                e.stopPropagation();
            }} onClick={() => navigate(`/orcamentos/create?id=${os.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                <CardTitle>{os.cliente || 'Sem Cliente'}</CardTitle>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', marginBottom: '8px' }}>
                    {os.followupRealizado ? (
                        <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '4px 6px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiCheckCircle /> Follow-up Feito
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#991b1b', padding: '4px 6px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiAlertCircle /> Pendente Retorno
                        </span>
                    )}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {os.itens?.length || 0} Itens na OS
                </div>

                <CardMetrics>
                    <div className="tag">Prazo: {os.dataValidade.split('-').reverse().join('/')}</div>
                    <div className="price">R$ {Number(os.valorTotalOrcamento || 0).toFixed(2).replace('.', ',')}</div>
                </CardMetrics>
            </div>
        </OSCard>
    );
}

// --- Componente Principal ---
export default function KanbanPage() {
    const { setTitlePage } = useDashboard();

    // Stores
    const statusOptions = useOrcamento(s => s.statusOptions);
    const allOrcamentos = useOrcamento(s => s.orcamentos).filter(o => !o.arquivado);
    const fetchOrcamentos = useOrcamento(s => s.fetchOrcamentos);
    const fetchStatusOptions = useOrcamento(s => s.fetchStatusOptions);
    const mudarStatus = useOrcamento(s => s.mudarStatus);

    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        setTitlePage('Gestão de O.S. (Kanban)');
        fetchOrcamentos();
        fetchStatusOptions();
    }, [setTitlePage, fetchOrcamentos, fetchStatusOptions]);

    // DnD Sensors setup para funcionar bem em Mouse e Touch
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Lógica para quando um card transitar entre colunas (Ainda no ar)
        // Para simplificar no Zustand Sync-State, só comitamos no DragEnd
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        const activeCardId = active.id as string;
        const overId = over.id as string;

        // O destino (over) pode ser outra OS da mesma coluna, de outra coluna, ou o Background da Coluna (SortableContext id)
        // 1. Identificar qual a nova Coluna (Status alvo)
        let newStatus = '';

        // É uma coluna vazia ou alvo diretor? (Column.id é a prop id do option)
        const isOverColumn = statusOptions.some(opt => opt.id === overId);

        if (isOverColumn) {
            newStatus = overId;
        } else {
            // Se dropou em cima de outro card de OS, herda o status desse card
            const targetCard = allOrcamentos.find(o => o.id === overId);
            if (targetCard) newStatus = targetCard.status;
        }

        // Se o status mudou, dispara a action do banco de dados (Supabase + auditoria)
        if (newStatus) {
            const activeOS = allOrcamentos.find(o => o.id === activeCardId);
            if (activeOS && activeOS.status !== newStatus) {
                mudarStatus(activeCardId, newStatus, activeOS.status);
            }
        }
    };

    const activeOSNode = activeId ? allOrcamentos.find(o => o.id === activeId) : null;

    return (
        <KanbanContainer>
            <BoardHeader>
                <Title><FiTrello /> Quadro de Ordens de Serviço</Title>
            </BoardHeader>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <BoardScrollArea>
                    {statusOptions.map((statusOp) => {
                        // Filtra OS desta Coluna
                        const columnOSes = allOrcamentos.filter(o => o.status === statusOp.id);

                        return (
                            // A própria coluna é um container Sortable para permitir dropar em colunas vazias
                            <SortableContext
                                key={statusOp.id}
                                id={statusOp.id}
                                items={columnOSes.map(o => o.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <ColumnContainer>
                                    <ColumnHeader $color={statusOp.color}>
                                        <span>{statusOp.label}</span>
                                        <span className="badge">{columnOSes.length}</span>
                                    </ColumnHeader>

                                    <ColumnBody>
                                        {columnOSes.map(os => (
                                            <SortableOSCard key={os.id} os={os} activeDragId={activeId} />
                                        ))}
                                        {columnOSes.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.85rem', border: '2px dashed #e2e8f0', borderRadius: '6px' }}>
                                                Nenhuma OS nesta etapa.
                                            </div>
                                        )}
                                    </ColumnBody>
                                </ColumnContainer>
                            </SortableContext>
                        );
                    })}
                </BoardScrollArea>

                {/* Overlay do Fantasma durante o Drag */}
                <DragOverlay>
                    {activeOSNode ? (
                        <OSCard style={{ cursor: 'grabbing', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="os-number">#{activeOSNode.numeroOs || '?'}</div>
                                    {activeOSNode.versaoOs && (
                                        <div style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                            Rev {activeOSNode.versaoOs}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardTitle>{activeOSNode.cliente}</CardTitle>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', marginBottom: '8px' }}>
                                {activeOSNode.followupRealizado ? (
                                    <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '4px 6px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><FiCheckCircle /> Follow-up Feito</span>
                                ) : (
                                    <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#991b1b', padding: '4px 6px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><FiAlertCircle /> Pendente Retorno</span>
                                )}
                            </div>

                            <CardMetrics>
                                <div className="price">R$ {Number(activeOSNode.valorTotalOrcamento || 0).toFixed(2).replace('.', ',')}</div>
                            </CardMetrics>
                        </OSCard>
                    ) : null}
                </DragOverlay>

            </DndContext>
        </KanbanContainer>
    );
}
