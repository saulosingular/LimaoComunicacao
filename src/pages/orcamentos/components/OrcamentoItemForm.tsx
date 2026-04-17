import React from 'react';
import { ITemplateDTO } from '@/shared/interfaces/template';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { useMateriaPrima } from '@/hooks/useMateriaPrima';
import { isCampoVisivel, calcularValorSecao } from '../utils/calculadoraMotor';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Row, SectionTitle } from '../create/styles';

interface Props {
    template: ITemplateDTO;
    respostas: Record<string, any>;
    onChangeResposta: (campoId: string, valor: any) => void;
    onAddAddon?: (addonTemplateId: string) => void;
    listaTemplates: { value: string; label: string }[];
    todosTemplates?: ITemplateDTO[];
    isEmbedded?: boolean;
    largura: number;
    altura: number;
    quantidade: number;
}

export function OrcamentoItemForm({ template, respostas, onChangeResposta, onAddAddon, listaTemplates, todosTemplates, isEmbedded, largura, altura, quantidade }: Props) {
    const materiasPrimas = useStoreHydration(useMateriaPrima, (s) => s.materiasPrimas) || [];

    /**
     * Retorna as opções de matéria prima filtradas pelo ID da categoria.
     * O campo "categoriaMateriaPrima" no template armazena o UUID da categoria (FK),
     * então filtramos por mp.categoriaId e não pelo nome textual.
     */
    const handleMateriaPrimaOptions = (categoriaId?: string) => {
        if (!categoriaId) return [];
        return materiasPrimas
            .filter((mp) => mp.categoriaId === categoriaId)
            .map((mp) => ({ value: mp.nome, label: `${mp.nome} (R$ ${mp.precoUnidade.toFixed(2)})` }));
    };

    return (
        <div style={{ padding: isEmbedded ? 0 : '1rem', borderTop: isEmbedded ? 'none' : '1px solid #e2e8f0', marginTop: isEmbedded ? 0 : '1rem' }}>
            {!isEmbedded && <h4 style={{ color: '#092147', marginBottom: '1rem' }}>Configuração do Produto: {template.nome}</h4>}

            {template.secoes.map((secao) => {
                const subT = calcularValorSecao({
                    secao, template, respostas, largura, altura, quantidade,
                    todosTemplates: todosTemplates || [], todasMateriasPrimas: materiasPrimas
                });

                return (
                    <div key={secao.id} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
                            <SectionTitle style={{ fontSize: '1rem', color: '#1a5f7a', margin: 0, padding: 0, border: 'none' }}>
                                {secao.nome}
                            </SectionTitle>
                            {subT > 0 && (
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                                    Adicional: R$ {subT.toFixed(2).replace('.', ',')}
                                </span>
                            )}
                        </div>
                        <Row>
                        {secao.campos.map((campo) => {
                            // Validação de Visibilidade
                            if (!isCampoVisivel(campo, respostas, template)) {
                                // TODO: idealmente deveria limpar a resposta no controle global se ficar invisível 
                                return null;
                            }

                            const valObj = { name: campo.id, value: respostas[campo.id] || '', onChange: (e: any) => onChangeResposta(campo.id, e.target.value) };

                            if (campo.tipoEntrada === 'SIM_NAO') {
                                return (
                                    <Select
                                        key={campo.id}
                                        label={campo.titulo}
                                        options={[
                                            { value: '', label: 'Selecione...' },
                                            { value: 'SIM', label: 'Sim' },
                                            { value: 'NAO', label: 'Não' }
                                        ]}
                                        {...valObj}
                                    />
                                );
                            }

                            if (campo.tipoEntrada === 'LISTA_OPCOES') {
                                const ops = [
                                    { value: '', label: 'Nenhuma Seleção' },
                                    ...(campo.opcoesLista || []).map(o => ({
                                        value: o.nome,
                                        label: o.nome + (o.valorAdicional ? ` (+ R$ ${o.valorAdicional})` : '')
                                    }))
                                ];
                                return <Select key={campo.id} label={campo.titulo} options={ops} {...valObj} />;
                            }

                            if (campo.tipoEntrada === 'SELECAO_GRUPO') {
                                const ops = [
                                    { value: '', label: 'Nenhuma Matéria Prima' },
                                    ...handleMateriaPrimaOptions(campo.categoriaMateriaPrima)
                                ];
                                return <Select key={campo.id} label={campo.titulo} options={ops} {...valObj} />;
                            }

                            if (campo.tipoEntrada === 'TEMPLATE') {
                                if (campo.templateId && todosTemplates) {
                                    const childTpl = todosTemplates.find(t => t.id === campo.templateId);
                                    if (childTpl) {
                                        return (
                                            <div key={campo.id} style={{ gridColumn: '1 / -1', padding: '1.25rem', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', marginTop: '0.5rem', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                                <OrcamentoItemForm
                                                    template={childTpl}
                                                    respostas={respostas}
                                                    onChangeResposta={onChangeResposta}
                                                    listaTemplates={listaTemplates}
                                                    todosTemplates={todosTemplates}
                                                    isEmbedded={true}
                                                    largura={largura}
                                                    altura={altura}
                                                    quantidade={quantidade}
                                                />
                                            </div>
                                        );
                                    }
                                }

                                const ops = [
                                    { value: '', label: 'Nenhum Adicional' },
                                    ...listaTemplates
                                ];
                                return <Select key={campo.id} label={campo.titulo} options={ops} {...valObj} />;
                            }

                            if (campo.tipoEntrada === 'ENTRADA_MANUAL') {
                                return (
                                    <Input
                                        key={campo.id}
                                        type={campo.tipoCalculo === 'QTDE' ? 'text' : 'text'}
                                        inputMode={campo.tipoCalculo === 'QTDE' ? 'decimal' : 'text'}
                                        label={campo.titulo}
                                        placeholder="Digite o valor..."
                                        {...valObj}
                                    />
                                );
                            }

                            return null;
                        })}
                    </Row>
                </div>
            )})}

            {!!template.addons?.length && (
                <div style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>
                    <SectionTitle style={{ fontSize: '1rem', color: '#1a5f7a' }}>Adicionais / Add-ons</SectionTitle>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {template.addons.map(addonId => {
                            const tplOption = listaTemplates.find(l => l.value === addonId);
                            if (!tplOption) return null;

                            return (
                                <div key={addonId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                                    <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                                        <span style={{ color: '#10b981', fontWeight: 600, marginRight: '8px' }}>+</span>
                                        Adicional Sugerido: <strong style={{ color: '#092147' }}>{tplOption.label}</strong>
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => onAddAddon && onAddAddon(addonId)}
                                        style={{ height: '32px', fontSize: '0.85rem', padding: '0 1rem', background: '#fff', border: '1px solid #cbd5e1' }}
                                    >
                                        Adicionar Item
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
