'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orcamentoService } from '@/shared/services';
import { dbToOrcamentoDTO } from '@/shared/utils/adapters';
import { IOrcamentoDTO, IOrcamentoItemDTO } from '@/shared/interfaces/orcamento';
import { FiPrinter, FiClipboard, FiAlertCircle } from 'react-icons/fi';
import { useTemplate } from '@/hooks/useTemplate';
import { useMateriaPrima } from '@/hooks/useMateriaPrima';
import {
    ProducaoContainer, ProducaoHeader, TituloHeader, InfoList, InfoBlock,
    ItensSection, ItemCard, ItemHeader, TagGroup, RespostasTable,
    SubItensList, DescricaoBlock, ObservacaoBlock, Footer, PrintButtonContainer
} from './styles';

export default function ProducaoPage() {
    const { id } = useParams<{ id: string }>();

    const [os, setOs] = useState<IOrcamentoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const { templates, fetchTemplates } = useTemplate();
    const { materiasPrimas, fetchMateriasPrimas } = useMateriaPrima();

    useEffect(() => {
        fetchTemplates();
        fetchMateriasPrimas();
    }, [fetchTemplates, fetchMateriasPrimas]);

    useEffect(() => {
        async function fetchOS() {
            if (!id) return;
            setLoading(true);
            const { data, error } = await orcamentoService.buscarCompleto(id);
            if (!error && data) {
                setOs(dbToOrcamentoDTO(data as any));
            }
            setLoading(false);
        }
        fetchOS();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Carregando dados...</div>;

    if (!os) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <FiAlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Ordem de Produção Indisponível</h2>
                <p style={{ color: '#64748b' }}>O sistema não encontrou esta O.P.</p>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const resolveRespostas = (item: IOrcamentoItemDTO) => {
        return Object.entries(item.respostas || {}).map(([campoId, val]) => {
           if (campoId.startsWith('__')) return null;

           let campo = null;
           for (const t of templates) {
               for (const s of t.secoes || []) {
                   campo = s.campos.find(c => c.id === campoId);
                   if (campo) break;
               }
               if (campo) break;
           }
           
           if (!campo) return null; // Previne exibição de UUIDs órfãos se o campo não existir mais
           
           let valueLabel = val;
           if (campo.tipoEntrada === 'LISTA_OPCOES') {
               const op = campo.opcoesLista?.find(o => o.id === val);
               if (op) valueLabel = op.nome;
           } else if (campo.tipoEntrada === 'SELECAO_GRUPO') {
               // Fallback / UUID guard
               const mp = materiasPrimas.find(m => m.id === val);
               if (mp) valueLabel = mp.nome;
           } else if (campo.tipoEntrada === 'TEMPLATE') {
               const childTpl = templates.find(t => t.id === val);
               if (childTpl) valueLabel = childTpl.nome;
           }
           
           // Evita imprimir respostas vazias
           if (valueLabel === '') return null;

           return [campo.titulo, valueLabel] as [string, any];
        }).filter(Boolean) as [string, any][];
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '2rem 1rem' }}>
            <ProducaoContainer>
                <ProducaoHeader>
                    <TituloHeader>
                        <h1>Ordem de Produção (O.P.)</h1>
                        <p>OS #{os.numeroOs ? `${os.numeroOs} ${os.versaoOs ? `(Rev ${os.versaoOs})` : ''}` : os.id.substring(0, 6).toUpperCase()}</p>
                    </TituloHeader>
                    <PrintButtonContainer>
                        <button onClick={handlePrint}>
                            <FiPrinter size={18} /> IMPRIMIR O.P.
                        </button>
                    </PrintButtonContainer>
                </ProducaoHeader>

                <InfoList>
                    <InfoBlock>
                        <label>Cliente</label>
                        <span>{os.cliente}</span>
                    </InfoBlock>
                    <InfoBlock>
                        <label>Data de Emissão</label>
                        <span>{os.dataCriacao.split('-').reverse().join('/')}</span>
                    </InfoBlock>
                    <InfoBlock>
                        <label>Previsão de Entrega</label>
                        <span>{os.dataEntrega ? os.dataEntrega.split('-').reverse().join('/') : 'A Combinar / Contrato'}</span>
                    </InfoBlock>
                    <InfoBlock>
                        <label>Status Atual</label>
                        <span>{os.status}</span>
                    </InfoBlock>
                </InfoList>

                <ItensSection>
                    <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                        <FiClipboard color="#475569" /> Roteiro de Produção
                    </h2>

                    {os.itens.map((item, idx) => {
                        const hasRespostas = Object.keys(item.respostas || {}).length > 0;

                        return (
                            <ItemCard key={item.id}>
                                <ItemHeader>
                                    <h3>{item.sequencia || idx + 1}. {item.nome}</h3>

                                    <TagGroup>
                                        <span className="quantidade">{item.quantidade} UN</span>
                                        <span className="dimensao">{item.largura}m x {item.altura}m</span>
                                    </TagGroup>
                                </ItemHeader>

                                {item.observacao && (
                                    <ObservacaoBlock>
                                        <strong>⚠️ ALERTA / OBSERVAÇÃO DO CLIENTE</strong>
                                        <p>{item.observacao}</p>
                                    </ObservacaoBlock>
                                )}

                                {item.descricao && (
                                    <DescricaoBlock>
                                        <strong>Descrição Detalhada</strong>
                                        <p>{item.descricao}</p>
                                    </DescricaoBlock>
                                )}

                                {item.anexos && item.anexos.length > 0 && (
                                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Referências Visuais / Artes Anexadas</strong>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {item.anexos.map((anexo, idx) => (
                                                <img key={idx} src={anexo} alt="Anexo Produção" style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain', border: '2px solid #cbd5e1', borderRadius: '8px', background: '#fff' }} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hasRespostas && (
                                    <RespostasTable>
                                        <table>
                                            <tbody>
                                                {resolveRespostas(item).map(([pergunta, resposta], i) => (
                                                    <tr key={pergunta + i}>
                                                        <th>{pergunta}</th>
                                                        <td>{resposta}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </RespostasTable>
                                )}

                                {item.subItens && item.subItens.length > 0 && (
                                    <SubItensList>
                                        <h4>Adicionais Acoplados</h4>
                                        <ul>
                                            {item.subItens.map(sub => (
                                                <li key={sub.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div>
                                                        {sub.quantidade}x {sub.nome}
                                                        {sub.largura && sub.altura ? ` (${sub.largura}m x ${sub.altura}m)` : ''}
                                                    </div>
                                                    {sub.descricao && (
                                                        <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1.2rem' }}>
                                                            ↳ <strong>Nota:</strong> {sub.descricao}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </SubItensList>
                                )}
                            </ItemCard>
                        )
                    })}
                </ItensSection>

                <Footer>
                    Ordem de Produção Interna gerada via Sistema. Uso Exclusivo Operacional. Documento isento de precificação.
                </Footer>
            </ProducaoContainer>
        </div>
    );
}
