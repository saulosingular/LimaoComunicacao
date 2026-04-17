'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCheck } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { OrcamentoItemForm } from './OrcamentoItemForm';
import { IOrcamentoItemDTO, IOrcamentoSubItemDTO } from '@/shared/interfaces/orcamento';
import { parseSafeNumber } from '@/shared/utils/numbers';
import { ITemplateDTO } from '@/shared/interfaces/template';
import { calcularValorItem } from '../utils/calculadoraMotor';
import { toast } from 'react-toastify';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: IOrcamentoItemDTO) => void;
    onAddAddon?: (templateId: string) => void;
    initialItem?: IOrcamentoItemDTO;
    templates: ITemplateDTO[];
    materiasPrimas: any[];
}

export function OrcamentoItemModal({ isOpen, onClose, onSave, onAddAddon, initialItem, templates, materiasPrimas }: Props) {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [respostas, setRespostas] = useState<Record<string, any>>({});
    const [quantidade, setQuantidade] = useState<string>('1');
    const [largura, setLargura] = useState<string>('1');
    const [altura, setAltura] = useState<string>('1');
    const [valorCalculado, setValorCalculado] = useState(0);

    // Novos Campos
    const [sequencia, setSequencia] = useState<number>(1);
    const [descricao, setDescricao] = useState<string>('');
    const [observacao, setObservacao] = useState<string>('');
    const [anexos, setAnexos] = useState<string[]>([]);
    const [subItens, setSubItens] = useState<any[]>([]);

    // Inicialização
    useEffect(() => {
        if (isOpen) {
            if (initialItem) {
                setSelectedTemplateId(initialItem.templateId);
                setRespostas(initialItem.respostas || {});
                setQuantidade(initialItem.quantidade?.toString() || '1');
                setLargura(initialItem.largura?.toString() || '1');
                setAltura(initialItem.altura?.toString() || '1');

                setSequencia(initialItem.sequencia || 1);
                setDescricao(initialItem.descricao || '');
                setObservacao(initialItem.observacao || '');
                setAnexos(initialItem.anexos || []);
                setSubItens((initialItem.subItens || []).map(s => ({
                    ...s,
                    quantidade: s.quantidade?.toString() || '1',
                    largura: s.largura?.toString() || '1',
                    altura: s.altura?.toString() || '1'
                })));
            } else {
                setSelectedTemplateId('');
                setRespostas({});
                setQuantidade('1');
                setLargura('1');
                setAltura('1');
                setValorCalculado(0);

                setSequencia(1); // ideal seria sequencia baseada no ultimo item
                setDescricao('');
                setObservacao('');
                setAnexos([]);
                setSubItens([]);
            }
        }
    }, [isOpen, initialItem]);

    // Recalculo em Tempo Real dentro do Modal
    useEffect(() => {
        if (!selectedTemplateId) {
            setValorCalculado(0);
            return;
        }

        const tpl = templates.find(t => t.id === selectedTemplateId);
        if (!tpl) return;

        const baseCalculado = calcularValorItem({
            template: tpl,
            respostas,
            quantidade: parseSafeNumber(quantidade) || 1,
            largura: parseSafeNumber(largura) || 1,
            altura: parseSafeNumber(altura) || 1,
            todosTemplates: templates,
            todasMateriasPrimas: materiasPrimas
        });

        const addonsCalculados = subItens.reduce((acc, sub) => {
            const tplSub = templates.find(t => t.id === sub.templateId);
            if (!tplSub) return acc;
            const valSub = calcularValorItem({
                template: tplSub,
                respostas: sub.respostas || {},
                quantidade: parseSafeNumber(sub.quantidade) || 1,
                largura: parseSafeNumber(sub.largura) || 1,
                altura: parseSafeNumber(sub.altura) || 1,
                todosTemplates: templates,
                todasMateriasPrimas: materiasPrimas
            });
            return acc + valSub;
        }, 0);

        setValorCalculado(baseCalculado + addonsCalculados);
    }, [selectedTemplateId, respostas, quantidade, largura, altura, subItens, templates, materiasPrimas]);

    if (!isOpen) return null;

    const handleAddAddon = (templateId: string) => {
        const tplAddon = templates.find(t => t.id === templateId);
        if (!tplAddon) return;

        const valorAddon = calcularValorItem({
            template: tplAddon,
            respostas: {},
            quantidade: parseSafeNumber(quantidade) || 1, // Geralmente add-ons acompanham a quantidade pai
            largura: parseSafeNumber(largura) || 1,
            altura: parseSafeNumber(altura) || 1,
            todosTemplates: templates,
            todasMateriasPrimas: materiasPrimas
        });

        setSubItens(prev => [...prev, {
            id: crypto.randomUUID(),
            templateId: tplAddon.id,
            nome: tplAddon.nome,
            valorItem: valorAddon,
            respostas: {},
            quantidade: quantidade || '1',
            largura: largura || '1',
            altura: altura || '1'
        }]);

        toast.success(`Add-on ${tplAddon.nome} adicionado ao Produto.`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setAnexos(prev => [...prev, base64]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveAnexo = (index: number) => {
        setAnexos(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveSubItem = (subId: string) => {
        setSubItens(prev => prev.filter(s => s.id !== subId));
    };

    const handleSubItemRespostaChange = (subId: string, campoId: string, valor: any) => {
        setSubItens(prev => prev.map(s => {
            if (s.id === subId) {
                return { ...s, respostas: { ...(s.respostas || {}), [campoId]: valor } };
            }
            return s;
        }));
    };

    const handleSubItemMedidaChange = (subId: string, campoId: 'quantidade' | 'largura' | 'altura' | 'descricao', valor: string) => {
        setSubItens(prev => prev.map(s => {
            if (s.id === subId) {
                return { ...s, [campoId]: valor };
            }
            return s;
        }));
    };

    const handleSave = () => {
        const tpl = templates.find(t => t.id === selectedTemplateId);
        if (!tpl) return;

        onSave({
            id: initialItem?.id || crypto.randomUUID(),
            templateId: tpl.id,
            nome: tpl.nome,
            quantidade: parseSafeNumber(quantidade),
            largura: parseSafeNumber(largura),
            altura: parseSafeNumber(altura),
            respostas,
            valorTotalItem: valorCalculado,
            sequencia,
            descricao,
            observacao,
            subItens: subItens.map(s => {
                const q = parseSafeNumber(s.quantidade) || 1;
                const l = parseSafeNumber(s.largura) || 1;
                const a = parseSafeNumber(s.altura) || 1;
                const tSub = templates.find(t => t.id === s.templateId);
                const valSub = tSub ? calcularValorItem({
                    template: tSub, respostas: s.respostas || {},
                    quantidade: q, largura: l, altura: a,
                    todosTemplates: templates, todasMateriasPrimas: materiasPrimas
                }) : s.valorItem;

                return { ...s, quantidade: q, largura: l, altura: a, valorItem: valSub, descricao: s.descricao };
            }),
            anexos
        });
        onClose();
    };

    const tplOptions = [{ value: '', label: 'Selecione um Produto / Serviço' }, ...templates.map(t => ({ value: t.id, label: t.nome }))];
    const activeTemplate = templates.find(t => t.id === selectedTemplateId);

    return (
        <Overlay>
            <ModalContainer>
                <Header>
                    <h3>{initialItem ? 'Editar Item da OS' : 'Adicionar Novo Item'}</h3>
                    <button onClick={onClose} aria-label="Fechar"><FiX size={24} /></button>
                </Header>

                <Body>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Select
                            name="templateSelect"
                            label="Produto Principal"
                            options={tplOptions}
                            value={selectedTemplateId}
                            onChange={e => setSelectedTemplateId(e.target.value)}
                            disabled={!!initialItem} // Proibe trocar template do item editado, melhor remover e criar outro
                        />
                    </div>

                    {activeTemplate && (
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'start' }}>
                                <Input name="quantidade" type="text" inputMode="decimal" label="Quantidade Final" value={quantidade} onChange={e => setQuantidade(e.target.value)} />
                                {['M2', 'ML'].includes(activeTemplate.formulaCalculo) && (
                                    <Input name="largura" type="text" inputMode="decimal" label="Largura / Comprimento Base (m)" value={largura} onChange={e => setLargura(e.target.value)} />
                                )}
                                {activeTemplate.formulaCalculo === 'M2' && (
                                    <Input name="altura" type="text" inputMode="decimal" label="Altura Base (m)" value={altura} onChange={e => setAltura(e.target.value)} />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTemplate && (
                        <div style={{ padding: '0 0 1rem 0', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                            <h4 style={{ color: '#092147', marginBottom: '1rem' }}>Detalhes do Serviço</h4>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                <div style={{ flex: '1', minWidth: '100px', maxWidth: '150px' }}>
                                    <Input name="sequencia" type="number" min="1" label="Ordem/Seq." value={sequencia} onChange={e => setSequencia(Number(e.target.value))} />
                                </div>
                                <div style={{ flex: '2', minWidth: '250px' }}>
                                    <Input name="descricao" type="text" label="Descrição (Aparece na via do Cliente)" placeholder="Detalhes técnicos, materiais usados, espessuras..." value={descricao} onChange={e => setDescricao(e.target.value)} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                <div style={{ flex: '1', minWidth: '250px' }}>
                                    <Input name="observacao" type="text" label="Observações Internas (Não aparece pro Cliente)" placeholder="Restrições, horário de entrega, dependências..." value={observacao} onChange={e => setObservacao(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTemplate && (
                        <OrcamentoItemForm
                            template={activeTemplate}
                            respostas={respostas}
                            onChangeResposta={(id, val) => setRespostas(prev => ({ ...prev, [id]: val }))}
                            onAddAddon={handleAddAddon}
                            listaTemplates={tplOptions.slice(1)}
                            todosTemplates={templates}
                            quantidade={parseSafeNumber(quantidade) || 1}
                            largura={parseSafeNumber(largura) || 1}
                            altura={parseSafeNumber(altura) || 1}
                        />
                    )}

                    {subItens.length > 0 && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', marginTop: '1rem', background: '#f8fafc' }}>
                            <h4 style={{ color: '#092147', marginBottom: '1rem', fontSize: '0.95rem' }}>Configuração dos Add-ons Selecionados</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {subItens.map(sub => {
                                    const tplSub = templates.find(t => t.id === sub.templateId);
                                    if (!tplSub) return null;

                                    const valSub = calcularValorItem({
                                        template: tplSub, respostas: sub.respostas || {},
                                        quantidade: parseSafeNumber(sub.quantidade) || 1, largura: parseSafeNumber(sub.largura) || 1, altura: parseSafeNumber(sub.altura) || 1,
                                        todosTemplates: templates, todasMateriasPrimas: materiasPrimas
                                    });

                                    return (
                                        <div key={sub.id} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ color: '#3b82f6', fontWeight: 600 }}>+</span>
                                                    <span style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{sub.nome}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '1rem' }}>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase' }}>Subtotal</span>
                                                        <span style={{ fontSize: '1.05rem', color: '#475569', fontWeight: 600 }}>
                                                            R$ {Number(valSub || 0).toFixed(2).replace('.', ',')}
                                                        </span>
                                                    </div>
                                                    <button type="button" onClick={() => handleRemoveSubItem(sub.id)} aria-label="Remover Addon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                                        <FiX size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Dimensões Próprias do Subitem se houver M2/ML necessário */}
                                            {['M2', 'ML', 'UNIDADE'].includes(tplSub.formulaCalculo) && (
                                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px' }}>
                                                    <div style={{ width: '100px' }}>
                                                        <Input
                                                            name={`qtde_${sub.id}`}
                                                            type="text"
                                                            inputMode="decimal"
                                                            label="Qtde"
                                                            value={sub.quantidade?.toString() || ''}
                                                            onChange={e => handleSubItemMedidaChange(sub.id, 'quantidade', e.target.value)}
                                                        />
                                                    </div>

                                                    {['M2', 'ML'].includes(tplSub.formulaCalculo) && (
                                                        <div style={{ width: '100px' }}>
                                                            <Input
                                                                name={`largura_${sub.id}`}
                                                                type="text"
                                                                inputMode="decimal"
                                                                label="Larg. (m)"
                                                                value={sub.largura?.toString() || ''}
                                                                onChange={e => handleSubItemMedidaChange(sub.id, 'largura', e.target.value)}
                                                            />
                                                        </div>
                                                    )}

                                                    {tplSub.formulaCalculo === 'M2' && (
                                                        <div style={{ width: '100px' }}>
                                                            <Input
                                                                name={`altura_${sub.id}`}
                                                                type="text"
                                                                inputMode="decimal"
                                                                label="Alt. (m)"
                                                                value={sub.altura?.toString() || ''}
                                                                onChange={e => handleSubItemMedidaChange(sub.id, 'altura', e.target.value)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div style={{ marginBottom: '1rem' }}>
                                                <Input
                                                    name={`descricao_${sub.id}`}
                                                    type="text"
                                                    label="Descrição Específica (Opcional)"
                                                    placeholder="Detalhar o destino do material (Ex: Parede Sala Comercial)"
                                                    value={sub.descricao || ''}
                                                    onChange={e => handleSubItemMedidaChange(sub.id, 'descricao', e.target.value)}
                                                />
                                            </div>

                                            <OrcamentoItemForm
                                                template={tplSub}
                                                respostas={sub.respostas || {}}
                                                onChangeResposta={(campoId, val) => handleSubItemRespostaChange(sub.id, campoId, val)}
                                                // Sem onAddAddon para evitar sub-sub-itens infinitos
                                                listaTemplates={[]}
                                                todosTemplates={templates}
                                                quantidade={parseSafeNumber(sub.quantidade) || 1}
                                                largura={parseSafeNumber(sub.largura) || 1}
                                                altura={parseSafeNumber(sub.altura) || 1}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTemplate && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#64748b', cursor: 'pointer', display: 'block', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                                    <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                                    📁 Clique para adicionar Fotos / Referência do Local / Arte do Cliente
                                </label>

                                {anexos.length > 0 && (
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        {anexos.map((anexo, idx) => (
                                            <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <img src={anexo} alt="Anexo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" onClick={() => handleRemoveAnexo(idx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Body>

                <Footer>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Valor do Item (Com Adicionais)</span>
                        <div style={{ fontSize: '1.75rem', color: '#10b981', fontWeight: 700 }}>
                            R$ {Number(valorCalculado || 0).toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="button" customColor="success" onClick={handleSave} disabled={!selectedTemplateId}>
                            <FiCheck /> Confirmar Item
                        </Button>
                    </div>
                </Footer>
            </ModalContainer>
        </Overlay>
    );
}

// Estilos
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: #fff;
  width: 95%;
  max-width: 1200px;
  max-height: 95vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;

  h3 { margin: 0; color: #0e2d5c; font-size: 1.4rem; font-weight: 700; }
  button { background: none; border: none; cursor: pointer; color: #64748b; transition: color 0.2s; &:hover { color: #ef4444; } }
`;

const Body = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  background: #fcfcfd;
`;

const Footer = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.05);
  z-index: 10;
`;
