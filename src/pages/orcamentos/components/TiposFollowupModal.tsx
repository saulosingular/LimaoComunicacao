'use client';

import React, { useState } from 'react';
import { FiX, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useOrcamento, ITipoFollowup } from '@/hooks/useOrcamento';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TiposFollowupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { tiposFollowup: tiposFollowupStore, addTipoFollowup, deleteTipoFollowup, fetchTiposFollowup } = useOrcamento();

    const [novoNome, setNovoNome] = useState('');
    const [novoDescricao, setNovoDescricao] = useState('');

    if (!isOpen) return null;

    const handleAdd = async () => {
        if (!novoNome) {
            toast.warn('Dê um nome para a Cadência.');
            return;
        }

        try {
            await addTipoFollowup({
                nome: novoNome,
                descricao: novoDescricao
            });

            toast.success('Tipo de Cadência cadastrado com sucesso!');
            setNovoNome('');
            setNovoDescricao('');
        } catch (err: any) {
            toast.error(err.message || 'Erro ao cadastrar cadência');
        }
    };

    const handleDelete = async (id: string, nome: string) => {
        if (window.confirm(`Tem certeza que deseja apagar a cadência "${nome}"?`)) {
            try {
                await deleteTipoFollowup(id);
                toast.info('Cadência removida.');
            } catch (err: any) {
                toast.error(err.message || 'Erro ao remover cadência');
            }
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, padding: '1rem'
        }}>
            <div style={{
                background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', maxHeight: '90vh'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>Gerenciador de Cadências (Follow-ups)</h2>
                    <Button variant="ghost" onClick={onClose} aria-label="Fechar" style={{ padding: '0.5rem' }}>
                        <FiX size={20} />
                    </Button>
                </div>

                <div style={{ padding: '1.5rem', overflowY: 'auto' }}>

                    <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', textTransform: 'uppercase' }}>Cadastrar Nova Estratégia</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Input name="novoNome" label="Nome da Cadência (Ex: Padrão 3 e 7 dias)" value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Ex: Relacionamento VIP" />
                                <Input name="novoDescricao" label="Descrição / Lembrete (Opcional)" value={novoDescricao} onChange={e => setNovoDescricao(e.target.value)} placeholder="Ex: Fazer contato amigável via IA a cada semana..." />
                            </div>
                            <Button type="button" customColor="primary" onClick={handleAdd} style={{ height: '42px', alignSelf: 'flex-start' }}>
                                <FiPlus /> Criar Regra
                            </Button>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '1rem' }}>Estratégias Cadastradas</h3>

                    {tiposFollowupStore.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Nenhum tipo de Follow-up cadastrado ainda.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {tiposFollowupStore.map(tipo => (
                                <div key={tipo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <strong style={{ color: '#092147', fontSize: '0.95rem' }}>{tipo.nome}</strong>
                                        {tipo.descricao && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{tipo.descricao}</span>}
                                    </div>
                                    <Button type="button" variant="ghost" customColor="danger" onClick={() => handleDelete(tipo.id, tipo.nome)} style={{ padding: '6px' }}>
                                        <FiTrash2 size={18} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} customColor="primary">Concluído</Button>
                </div>
            </div>
        </div>
    );
}
