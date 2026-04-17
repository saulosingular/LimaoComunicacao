'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiSave, FiCheckCircle, FiPackage, FiTrash2, FiSettings, FiArrowLeft, FiEdit3, FiExternalLink, FiCopy, FiArchive, FiClipboard } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useDashboard } from '@/hooks/useDashboard';
import { useOrcamento } from '@/hooks/useOrcamento';
import { useTemplate } from '@/hooks/useTemplate';
import { useMateriaPrima } from '@/hooks/useMateriaPrima';
import { IOrcamentoDTO, IOrcamentoItemDTO } from '@/shared/interfaces/orcamento';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { FormContainer, SectionTitle, Row, FlexEndRow, TotalBanner } from './styles';
import { OrcamentoItemModal } from '../components/OrcamentoItemModal';
import { TiposFollowupModal } from '../components/TiposFollowupModal';

export default function CreateOrcamentoPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const { setTitlePage } = useDashboard();
    const {
        orcamentos, addOrcamento, updateOrcamento, archiveOrcamento, duplicateOrcamento,
        statusOptions: statusOptionsStore, tiposFollowup: tiposFollowupStore,
        fetchOrcamentos, fetchStatusOptions, fetchTiposFollowup, fetchOrcamentoCompleto,
    } = useOrcamento();
    const { templates, fetchTemplates } = useTemplate();
    const { materiasPrimas, fetchMateriasPrimas } = useMateriaPrima();

    const [orcamentoAtual, setOrcamentoAtual] = useState<IOrcamentoDTO | undefined>(undefined);

    // Fetch data on mount
    useEffect(() => {
        fetchOrcamentos();
        fetchStatusOptions();
        fetchTiposFollowup();
        fetchTemplates();
        fetchMateriasPrimas();
    }, []);

    // Fetch full orcamento when editing
    useEffect(() => {
        if (id) {
            fetchOrcamentoCompleto(id).then(orc => {
                if (orc) setOrcamentoAtual(orc);
            });
        }
    }, [id]);

    const { register, control, handleSubmit, reset, watch, setValue } = useForm<Omit<IOrcamentoDTO, 'id'>>({
        defaultValues: {
            cliente: '',
            whatsapp: '',
            dataCriacao: new Date().toISOString().split('T')[0],
            dataValidade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'RASCUNHO',
            valorTotalOrcamento: 0,
            itens: []
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IOrcamentoItemDTO | undefined>(undefined);

    // Controle Tabs
    const [activeTab, setActiveTab] = useState<'dados' | 'itens' | 'logistica' | 'followup'>('dados');

    // Controle Modais de Follow Up
    const [isTiposFollowOpen, setIsTiposFollowOpen] = useState(false);

    // Controle Novo Follow Up Entry
    const [novoFollowData, setNovoFollowData] = useState(new Date().toISOString().split('T')[0]);
    const [novoFollowTipo, setNovoFollowTipo] = useState('WhatsApp');
    const [novoFollowObs, setNovoFollowObs] = useState('');

    const { fields: followups, append: appendFollowup, remove: removeFollowup } = useFieldArray({
        control,
        name: 'followups'
    });

    const formValues = watch();
    const watchItens = formValues.itens || [];

    useEffect(() => {
        setTitlePage(id ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço');
        if (id && orcamentoAtual) {
            reset(orcamentoAtual as any);
        }
    }, [id, orcamentoAtual, setTitlePage, reset]);

    const handleSaveItemModal = async (newItem: IOrcamentoItemDTO) => {
        const itemExistsIndex = watchItens.findIndex((i: any) => i.id === newItem.id);

        let newItens = [...watchItens];
        if (itemExistsIndex >= 0) {
            newItens[itemExistsIndex] = newItem;
        } else {
            newItens.push(newItem);
        }

        setValue('itens', newItens as any, { shouldDirty: true });

        // Recalcula Valor Total Geral
        const newTotal = newItens.reduce((acc, val) => acc + (val.valorTotalItem || 0), 0);
        setValue('valorTotalOrcamento', newTotal, { shouldDirty: true });

        // Auto-save se a OS já estiver persistida (Garante que todo item modificado esteja salvo de imediato)
        if (id) {
            try {
                const currentData = { ...watch(), itens: newItens, valorTotalOrcamento: newTotal };
                await updateOrcamento(id, currentData);
            } catch (err: any) {
                toast.error('Erro na gravação automática do item no sistema.');
            }
        }
    };

    const handleRemoveItem = async (index: number) => {
        const newItens = watchItens.filter((_: any, i: number) => i !== index);
        setValue('itens', newItens as any, { shouldDirty: true });
        const newTotal = newItens.reduce((acc: number, val: any) => acc + (val.valorTotalItem || 0), 0);
        setValue('valorTotalOrcamento', newTotal, { shouldDirty: true });

        // Auto-save se a OS já estiver persistida
        if (id) {
            try {
                const currentData = { ...watch(), itens: newItens, valorTotalOrcamento: newTotal };
                await updateOrcamento(id, currentData);
                toast.success('Item removido com sucesso.');
            } catch (err: any) {
                toast.error('Erro ao remover o item no sistema.');
            }
        }
    };

    const openEditModal = (item: IOrcamentoItemDTO) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingItem(undefined);
        setIsModalOpen(true);
    };

    const handleAddFollowup = () => {
        if (!novoFollowData || !novoFollowObs) {
            toast.warn('Preencha a data e observação para registrar o follow-up.');
            return;
        }

        appendFollowup({
            id: crypto.randomUUID(),
            data: novoFollowData,
            tipo: novoFollowTipo,
            observacao: novoFollowObs
        });

        setNovoFollowData(new Date().toISOString().split('T')[0]);
        setNovoFollowObs('');
        setValue('followupRealizado', true, { shouldDirty: true });
        toast.success('Follow-up registrado com sucesso!');
    };

    const onSubmit = async (data: any) => {
        try {
            if (id) {
                await updateOrcamento(id, data);
                toast.success('OS atualizada com sucesso!');
            } else {
                await addOrcamento(data);
                toast.success('OS criada com sucesso!');
            }
            navigate('/orcamentos');
        } catch (err: any) {
            toast.error(err.message || 'Erro ao salvar OS');
        }
    };

    const handleCopyLink = () => {
        if (!id) return;
        const link = `${window.location.origin}/proposta/${id}`;
        navigator.clipboard.writeText(link);
        toast.info('Link da proposta copiado para a área de transferência!');
    };

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '0.75rem 1.5rem',
        background: isActive ? '#fff' : 'transparent',
        color: isActive ? '#0f172a' : '#64748b',
        border: 'none',
        borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
        fontWeight: isActive ? 600 : 500,
        fontSize: '1rem',
        cursor: 'pointer',
        transition: '0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    });

    return (
        <div style={{ paddingBottom: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            {/* --- HEADER ACTIONS --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Voltar para Gestão de OS
                </Button>

                {id && orcamentoAtual && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem' }}>
                            <span style={{ fontWeight: 600, color: '#092147', fontSize: '1.1rem' }}>
                                OS #{orcamentoAtual.numeroOs || '?'} {orcamentoAtual.versaoOs ? `Rev ${orcamentoAtual.versaoOs}` : ''}
                            </span>
                            {orcamentoAtual.arquivado && (
                                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Arquivada</span>
                            )}
                        </div>

                        <Button variant="ghost" type="button" onClick={async () => { try { await duplicateOrcamento(id); navigate('/orcamentos'); toast.success('OS Duplicada com sucesso!'); } catch { toast.error('Erro ao duplicar OS'); } }} style={{ background: '#fff', border: '1px solid #cbd5e1' }}>
                            <FiCopy /> Duplicar
                        </Button>
                        <Button variant="ghost" type="button" onClick={async () => { try { await archiveOrcamento(id); navigate('/orcamentos'); toast.success('OS Arquivada/Desarquivada com sucesso!'); } catch { toast.error('Erro ao arquivar OS'); } }} style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#ef4444' }}>
                            <FiArchive /> {orcamentoAtual.arquivado ? 'Desarquivar' : 'Arquivar'}
                        </Button>

                        <Button variant="ghost" type="button" onClick={() => window.open(`/producao/${id}`, '_blank')} style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#16a34a' }}>
                            <FiClipboard /> Ordem Produção
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => window.open(`/proposta/${id}`, '_blank')} style={{ background: '#fff', border: '1px solid #cbd5e1' }}>
                            <FiExternalLink /> Ver Proposta ao Vivo
                        </Button>
                        <Button variant="ghost" type="button" onClick={handleCopyLink} style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#0369a1' }}>
                            <FiCopy /> Copiar Link
                        </Button>
                    </div>
                )}
            </div>

            {/* --- TABS --- */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem', overflowX: 'auto' }}>
                <button type="button" onClick={() => setActiveTab('dados')} style={tabStyle(activeTab === 'dados')}>
                    📄 Dados Principais
                </button>
                <button type="button" onClick={() => setActiveTab('itens')} style={tabStyle(activeTab === 'itens')}>
                    📦 Itens ({watchItens.length})
                </button>
                <button type="button" onClick={() => setActiveTab('logistica')} style={tabStyle(activeTab === 'logistica')}>
                    💳 Comercial & Logística
                </button>
                <button type="button" onClick={() => setActiveTab('followup')} style={tabStyle(activeTab === 'followup')}>
                    💬 Follow-up / CRM
                </button>
            </div>

            <FormContainer onSubmit={handleSubmit(onSubmit)}>

                {/* -------------------- TAB: DADOS PRINCIPAIS -------------------- */}
                {activeTab === 'dados' && (
                    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <SectionTitle>Dados e Contatos da Negociação</SectionTitle>
                        <Row>
                            <Input {...register('cliente')} label="Nome do Cliente / Empresa" placeholder="Ex: Gráfica Expressa Ltda" required />
                            <Input {...register('whatsapp')} label="WhatsApp / Telefone" placeholder="Ex: (11) 99999-9999" />
                        </Row>
                        <Row style={{ marginTop: '1.5rem' }}>
                            <Select
                                {...register('status')}
                                label="Status do Kanban"
                                options={statusOptionsStore.map(s => ({ value: s.id, label: s.label }))}
                                required
                            />
                            <Input {...register('dataCriacao')} type="date" label="Data de Criação" required />
                            <Input {...register('dataValidade')} type="date" label="Validade da O.S." required />
                        </Row>
                        <Row style={{ marginTop: '1.5rem' }}>
                            <Select
                                {...register('origemCliente')}
                                label="Como o Cliente Chegou?"
                                options={[
                                    { value: '', label: 'Não Informado' },
                                    { value: 'WhatsApp', label: 'WhatsApp' },
                                    { value: 'Instagram', label: 'Instagram' },
                                    { value: 'GoogleAds', label: 'Google / Pesquisa' },
                                    { value: 'Indicacao', label: 'Indicação' },
                                    { value: 'Fachada', label: 'Passou na Loja / Fachada' },
                                    { value: 'Outro', label: 'Outro' }
                                ]}
                            />
                        </Row>
                    </div>
                )}

                {/* -------------------- TAB: ITENS DA OS -------------------- */}
                {activeTab === 'itens' && (
                    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <SectionTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Itens Negociados</span>
                            <Button type="button" onClick={openCreateModal}>
                                <FiPlus /> Adicionar Novo Item
                            </Button>
                        </SectionTitle>

                        {watchItens.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                                Nenhum item configurado nesta OS ainda.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {watchItens.map((item: any, index: number) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.03)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#092147', fontSize: '1.1rem', marginBottom: '8px' }}>
                                                <span style={{ color: '#3b82f6', marginRight: '8px' }}>#{item.sequencia || index + 1}</span>
                                                {item.nome}
                                            </h4>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '6px', fontWeight: 500 }}>
                                                    Qtde: {item.quantidade}x
                                                </span>
                                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '6px', fontWeight: 500 }}>
                                                    Dimensões: {item.largura}m x {item.altura}m
                                                </span>
                                            </div>
                                            {item.descricao && (
                                                <span style={{ color: '#475569', fontSize: '0.85rem', fontStyle: 'italic', display: 'block', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                                                    "{item.descricao}"
                                                </span>
                                            )}
                                            {item.anexos && item.anexos.length > 0 && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontSize: '0.8rem', marginTop: '8px', fontWeight: 600, background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                                                    📎 {item.anexos.length} anexo(s)
                                                </span>
                                            )}
                                            {item.subItens && item.subItens.length > 0 && (
                                                <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {item.subItens.map((sub: any) => (
                                                        <span key={sub.id} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>
                                                            + {sub.nome}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total do Item</span>
                                                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#10b981' }}>
                                                    R$ {Number(item.valorTotalItem || 0).toFixed(2).replace('.', ',')}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button type="button" variant="ghost" onClick={() => openEditModal(item)} style={{ border: '1px solid #cbd5e1' }}>
                                                    ✏️ Editar
                                                </Button>
                                                <Button type="button" variant="ghost" customColor="danger" onClick={() => handleRemoveItem(index)}>
                                                    <FiTrash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* -------------------- TAB: COMERCIAL & LOGISTICA -------------------- */}
                {activeTab === 'logistica' && (
                    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <SectionTitle>Logística e Termos de Pagamento</SectionTitle>
                        <Row>
                            <Input {...register('dataEntrega')} type="date" label="Previsão de Entrega (Opcional)" />

                            <Select
                                {...register('condicaoPagamento')}
                                label="Condição de Pagamento"
                                options={[
                                    { value: '', label: 'Não Definida' },
                                    { value: 'À Vista Integral', label: 'À Vista Integral' },
                                    { value: '50% Sinal + 50% Entrega', label: '50% Sinal + 50% Entrega' },
                                    { value: 'Sinal + Cartão Crédito', label: 'Sinal + Cartão Crédito' },
                                    { value: 'Cartão de Crédito 100%', label: 'Cartão de Crédito 100%' },
                                    { value: 'Boleto Faturado', label: 'Boleto Faturado' }
                                ]}
                            />

                            <Select
                                {...register('prazoPagamento')}
                                label="Prazo Pagamento"
                                options={[
                                    { value: '', label: 'Não Definido' },
                                    { value: 'Imediato', label: 'Imediato' },
                                    { value: '7 Dias', label: '7 Dias' },
                                    { value: '15 Dias', label: '15 Dias' },
                                    { value: '30 Dias', label: '30 Dias' },
                                    { value: '15/30 Dias', label: '15/30 Dias' },
                                    { value: '30/60/90 Dias', label: '30/60/90 Dias' }
                                ]}
                            />
                        </Row>
                        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                            💡 Dica: Condições e prazos preenchidos aqui serão exibidos automaticamente na impressão do orçamento (PDF).
                        </div>
                    </div>
                )}

                {/* -------------------- TAB: FOLLOWUP E CRM -------------------- */}
                {activeTab === 'followup' && (
                    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <SectionTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Configuração de Cadência</span>
                            <Button type="button" variant="ghost" onClick={() => setIsTiposFollowOpen(true)} style={{ border: '1px solid #cbd5e1' }}>
                                <FiSettings /> Gerenciar Tipos de Follow-up
                            </Button>
                        </SectionTitle>

                        <Row style={{ marginBottom: '2rem' }}>
                            <Select
                                {...register('tipoFollowupId')}
                                label="Qual será a estratégia (cadência) aplicada neste cliente?"
                                options={[
                                    { value: '', label: 'Nenhuma Estratégia Definida' },
                                    ...tiposFollowupStore.map(tf => ({ value: tf.id, label: tf.nome }))
                                ]}
                            />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: '#10b981', fontWeight: 600, cursor: 'pointer', background: '#ecfdf5', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #10b981' }}>
                                    <input type="checkbox" {...register('followupRealizado')} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                    Follow-up está em dia (Retirar Alerta do Quadro Kanban)
                                </label>
                            </div>
                        </Row>

                        <SectionTitle>Diário de Contatos com o Cliente</SectionTitle>

                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', background: '#fff', padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                <div style={{ minWidth: '150px' }}>
                                    <Input name="fData" type="date" label="Data Contato" value={novoFollowData} onChange={e => setNovoFollowData(e.target.value)} />
                                </div>
                                <div style={{ minWidth: '180px' }}>
                                    <Select name="fTipo" label="Canal" value={novoFollowTipo} onChange={e => setNovoFollowTipo(e.target.value)} options={[
                                        { value: 'WhatsApp', label: 'WhatsApp IA / Manual' },
                                        { value: 'Telefone', label: 'Ligação' },
                                        { value: 'Email', label: 'E-mail' },
                                        { value: 'Reuniao', label: 'Reunião / Visita' }
                                    ]} />
                                </div>
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <Input name="fObs" label="Resumo da Conversa" placeholder="Ex: IA enviou oferta, cliente disse que analisa com sócio" value={novoFollowObs} onChange={e => setNovoFollowObs(e.target.value)} />
                                </div>
                                <div>
                                    <Button type="button" onClick={handleAddFollowup} customColor="primary" style={{ height: '42px', width: '100%' }}>
                                        <FiPlus /> Registrar
                                    </Button>
                                </div>
                            </div>

                            {followups.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', padding: '1rem 0' }}>
                                    Nenhum contato registrado no diário até o momento.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {followups.map((f: any, idx) => (
                                        <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{f.data.split('-').reverse().join('/')}</span>
                                                <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>{f.tipo}</span>
                                                <span style={{ color: '#0f172a', fontSize: '1rem' }}>{f.observacao}</span>
                                            </div>
                                            <Button type="button" variant="ghost" customColor="danger" onClick={() => removeFollowup(idx)} style={{ padding: '6px' }} title="Remover Histórico">
                                                <FiTrash2 size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ----------------- FIXO NO RODAPÉ ----------------- */}
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e2e8f0' }}>
                    <TotalBanner>
                        <span>Valor Total da Ordem de Serviço</span>
                        <span>R$ {Number(watch('valorTotalOrcamento') || 0).toFixed(2).replace('.', ',')}</span>
                    </TotalBanner>

                    <FlexEndRow>
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancelar e Sair</Button>
                        <Button type="submit" customColor="success">
                            <FiSave /> Salvar Ordem de Serviço
                        </Button>
                    </FlexEndRow>
                </div>
            </FormContainer>

            <OrcamentoItemModal
                isOpen={isModalOpen}
                initialItem={editingItem}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItemModal}
                templates={templates}
                materiasPrimas={materiasPrimas}
            />

            <TiposFollowupModal
                isOpen={isTiposFollowOpen}
                onClose={() => setIsTiposFollowOpen(false)}
            />
        </div>
    );
}
