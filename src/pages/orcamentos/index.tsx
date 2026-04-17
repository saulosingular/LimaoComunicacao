'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useDashboard } from '@/hooks/useDashboard';
import { useOrcamento } from '@/hooks/useOrcamento';
import { IOrcamentoDTO } from '@/shared/interfaces/orcamento';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomTable, ITableColumn } from '@/components/ui/customTable';

import { PageContainer, HeaderActions, FiltersContainer, TableActionsContainer } from './styles';

export default function OrcamentosPage() {
    const navigate = useNavigate();
    const { setTitlePage } = useDashboard();

    const orcamentos = useOrcamento((state) => state.orcamentos);
    const loading = useOrcamento((state) => state.loading);
    const fetchOrcamentos = useOrcamento((state) => state.fetchOrcamentos);
    const deleteOrcamento = useOrcamento((state) => state.deleteOrcamento);

    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'ativas' | 'arquivadas'>('ativas');

    useEffect(() => {
        setTitlePage('Orçamentos');
        fetchOrcamentos();
    }, [setTitlePage, fetchOrcamentos]);

    const handleEdit = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        navigate(`/orcamentos/create?id=${id}`);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Tem certeza que deseja cancelar e remover este orçamento?')) {
            try {
                await deleteOrcamento(id);
                toast.info('Orçamento removido com sucesso!');
            } catch {
                toast.error('Erro ao remover orçamento.');
            }
        }
    };

    const columns: ITableColumn<IOrcamentoDTO>[] = [
        {
            key: 'numeroOs',
            label: 'Nº OS',
            width: '100px',
            render: (_, row) => {
                const num = row.numeroOs || '?';
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: '#092147' }}>#{num}</span>
                        {row.versaoOs && (
                            <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                Rev {row.versaoOs}
                            </span>
                        )}
                    </div>
                );
            }
        },
        { key: 'cliente', label: 'Cliente' },
        {
            key: 'dataCriacao',
            label: 'Data',
            width: '120px',
            render: (val) => new Date(val as string).toLocaleDateString('pt-BR')
        },
        {
            key: 'dataValidade',
            label: 'Validade',
            width: '120px',
            render: (val) => new Date(val as string).toLocaleDateString('pt-BR')
        },
        { key: 'status', label: 'Status', width: '150px' },
        {
            key: 'valorTotalOrcamento',
            label: 'Valor Total',
            width: '180px',
            render: (val) => `R$ ${Number(val).toFixed(2).replace('.', ',')}`
        },
        {
            key: 'actions',
            label: 'Ações',
            width: '120px',
            render: (_, row) => (
                <TableActionsContainer>
                    <Button variant="ghost" customColor="info" aria-label="Visualizar" onClick={(e) => handleEdit(row.id, e)}>
                        <FiEdit2 />
                    </Button>
                    <Button variant="ghost" customColor="danger" aria-label="Remover" onClick={(e) => handleDelete(row.id, e)}>
                        <FiTrash2 />
                    </Button>
                </TableActionsContainer>
            ),
        },
    ];

    const filteredData = useMemo(() => {
        if (!orcamentos) return [];
        return orcamentos.filter((orc) => {
            const matchArchived = viewMode === 'arquivadas' ? !!orc.arquivado : !orc.arquivado;
            const matchSearch = orc.cliente.toLowerCase().includes(searchTerm.toLowerCase());
            return matchArchived && matchSearch;
        });
    }, [orcamentos, searchTerm, viewMode]);

    return (
        <PageContainer>
            <HeaderActions>
                <FiltersContainer>
                    <div style={{ display: 'flex', gap: '0.25rem', background: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('ativas')}
                            style={{
                                background: viewMode === 'ativas' ? '#fff' : 'transparent',
                                color: viewMode === 'ativas' ? '#0f172a' : '#64748b',
                                boxShadow: viewMode === 'ativas' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                fontWeight: viewMode === 'ativas' ? 600 : 400
                            }}
                        >
                            Ativas
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('arquivadas')}
                            style={{
                                background: viewMode === 'arquivadas' ? '#fff' : 'transparent',
                                color: viewMode === 'arquivadas' ? '#0f172a' : '#64748b',
                                boxShadow: viewMode === 'arquivadas' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                fontWeight: viewMode === 'arquivadas' ? 600 : 400
                            }}
                        >
                            Arquivadas
                        </Button>
                    </div>
                    <div style={{ width: '350px' }}>
                        <Input
                            name="search"
                            placeholder="Buscar por cliente..."
                            icon={FiSearch}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </FiltersContainer>

                <Button customColor="primary" onClick={() => navigate('/orcamentos/create')}>
                    <FiPlus size={20} />
                    Novo Orçamento
                </Button>
            </HeaderActions>

            <CustomTable
                columns={columns}
                data={filteredData}
                emptyMessage={loading ? 'Carregando...' : 'Nenhum orçamento encontrado.'}
                onRowClick={(row) => handleEdit(row.id)}
            />
        </PageContainer>
    );
}
