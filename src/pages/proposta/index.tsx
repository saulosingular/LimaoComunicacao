'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orcamentoService } from '@/shared/services';
import { dbToOrcamentoDTO } from '@/shared/utils/adapters';
import { IOrcamentoDTO, IOrcamentoItemDTO } from '@/shared/interfaces/orcamento';
import { FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTemplate } from '@/hooks/useTemplate';
import { useMateriaPrima } from '@/hooks/useMateriaPrima';
import {
    PropostaContainer, PropostaHeader, EmpresaNome, InfoList, InfoBlock,
    ItensSection, ItemCard, ItemDetails, TagGroup, ItemPrice,
    SubItensList, SubItemTag, TotalBanner, Footer
} from './styles';
import { ChatIA } from './components/ChatIA';

export default function PropostaPage() {
    const { id } = useParams<{ id: string }>();
    const resolvedId = id!;

    const [proposta, setProposta] = useState<IOrcamentoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApprovedLocal, setIsApprovedLocal] = useState(false);

    const { templates, fetchTemplates } = useTemplate();
    const { materiasPrimas, fetchMateriasPrimas } = useMateriaPrima();

    useEffect(() => {
        fetchTemplates();
        fetchMateriasPrimas();
    }, [fetchTemplates, fetchMateriasPrimas]);

    useEffect(() => {
        async function fetchProposta() {
            setLoading(true);
            const { data, error } = await orcamentoService.buscarCompleto(resolvedId);
            if (!error && data) {
                setProposta(dbToOrcamentoDTO(data as any));
            }
            setLoading(false);
        }
        fetchProposta();
    }, [resolvedId]);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Carregando dados...</div>;

    if (!proposta) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: 'sans-serif' }}>
                <FiFileText size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Proposta Indisponível</h2>
                <p style={{ color: '#64748b', maxWidth: '400px', textAlign: 'center' }}>
                    Não foi possível encontrar o orçamento solicitado. Verifique se o link está correto ou entre em contato com a empresa responsável.
                </p>
            </div>
        );
    }

    const isApproved = proposta.status === 'APROVADO' || proposta.status === 'PRODUCAO' || proposta.status === 'CONCLUIDO' || isApprovedLocal;

    const handleApprove = async () => {
        try {
            await orcamentoService.mudarStatus(proposta.id, 'APROVADO', proposta.status);
            setProposta(prev => prev ? { ...prev, status: 'APROVADO' } : prev);
            setIsApprovedLocal(true);
            toast.success('Proposta aprovada com sucesso! Obrigado pela confiança.', { position: 'bottom-center' });

            // Auto scroll to PIX smoothly
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 300);
        } catch {
            toast.error('Erro ao aprovar proposta. Tente novamente.');
        }
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
           
           if (!campo) return null;
           
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
           
           if (valueLabel === '') return null;
           return [campo.titulo, valueLabel] as [string, any];
        }).filter(Boolean) as [string, any][];
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '2rem 1rem' }}>
            <PropostaContainer>
                <PropostaHeader>
                    <EmpresaNome>Apresentação Comercial</EmpresaNome>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>Proposta #{proposta.id.substring(0, 6).toUpperCase()}</p>
                </PropostaHeader>

                <InfoList>
                    <InfoBlock>
                        <label>Cliente</label>
                        <span>{proposta.cliente}</span>
                    </InfoBlock>
                    {proposta.whatsapp && (
                        <InfoBlock>
                            <label>Contato</label>
                            <span>{proposta.whatsapp}</span>
                        </InfoBlock>
                    )}
                    <InfoBlock>
                        <label>Emissão</label>
                        <span><FiClock style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {proposta.dataCriacao.split('-').reverse().join('/')}</span>
                    </InfoBlock>
                    <InfoBlock>
                        <label>Validade</label>
                        <span><FiCheckCircle style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {proposta.dataValidade.split('-').reverse().join('/')}</span>
                    </InfoBlock>
                </InfoList>

                {(proposta.condicaoPagamento || proposta.prazoPagamento) && (
                    <InfoList style={{ marginTop: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        {proposta.condicaoPagamento && (
                            <InfoBlock>
                                <label style={{ color: '#1e40af' }}>Condição de Pagamento</label>
                                <span style={{ color: '#1e3a8a', fontWeight: 600 }}>{proposta.condicaoPagamento}</span>
                            </InfoBlock>
                        )}
                        {proposta.prazoPagamento && (
                            <InfoBlock>
                                <label style={{ color: '#1e40af' }}>Prazo de Pagamento</label>
                                <span style={{ color: '#1e3a8a', fontWeight: 600 }}>{proposta.prazoPagamento}</span>
                            </InfoBlock>
                        )}
                        {proposta.dataEntrega && (
                            <InfoBlock>
                                <label style={{ color: '#1e40af' }}>Previsão de Entrega</label>
                                <span style={{ color: '#1e3a8a', fontWeight: 600 }}>{proposta.dataEntrega.split('-').reverse().join('/')}</span>
                            </InfoBlock>
                        )}
                    </InfoList>
                )}

                <ItensSection>
                    <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiFileText color="#3b82f6" /> Especificação dos Itens
                    </h2>

                    {proposta.itens.map((item, idx) => (
                        <ItemCard key={item.id}>
                            <ItemDetails>
                                <h3>{item.sequencia || idx + 1}. {item.nome}</h3>

                                <TagGroup>
                                    <span className="tag quantidade">{item.quantidade}x Unidades</span>
                                    <span className="tag dimensao">Dimensões: {item.largura}m x {item.altura}m</span>
                                </TagGroup>

                                {item.descricao && (
                                    <p>"{item.descricao}"</p>
                                )}

                                {item.observacao && (
                                    <p style={{ background: '#fef2f2', borderLeft: '3px solid #ef4444', padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#991b1b', marginTop: '1rem' }}>
                                        <strong>Observação:</strong> {item.observacao}
                                    </p>
                                )}

                                {Object.keys(item.respostas || {}).length > 0 && (
                                    <div style={{ marginTop: '1rem', background: '#f8fafc', borderRadius: '6px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                        <h4 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Especificações Técnicas:</h4>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            {resolveRespostas(item).map(([pergunta, resposta], i) => (
                                                <li key={pergunta + i} style={{ fontSize: '0.95rem', color: '#1e293b', display: 'flex', gap: '8px' }}>
                                                    <span style={{ color: '#64748b', fontWeight: 600, minWidth: '150px' }}>{pergunta}:</span> 
                                                    <span>{resposta}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {item.subItens && item.subItens.length > 0 && (
                                    <SubItensList style={{ marginTop: '1rem' }}>
                                        {item.subItens.map(sub => (
                                            <SubItemTag key={sub.id}>
                                                + {sub.nome}
                                                {sub.descricao && <span style={{display: 'inline', marginLeft: '5px', color: '#475569', fontWeight: 500}}> - {sub.descricao}</span>}
                                            </SubItemTag>
                                        ))}
                                    </SubItensList>
                                )}
                            </ItemDetails>
                            <ItemPrice>
                                <span style={{ fontSize: '0.9rem', marginRight: '4px' }}>R$</span>
                                {Number(item.valorTotalItem || 0).toFixed(2).replace('.', ',')}
                            </ItemPrice>
                        </ItemCard>
                    ))}
                </ItensSection>

                <TotalBanner>
                    <span>Investimento Total</span>
                    <strong>R$ {Number(proposta.valorTotalOrcamento || 0).toFixed(2).replace('.', ',')}</strong>
                </TotalBanner>

                {/* --- CALL TO ACTION / PAYMENT --- */}
                {!isApproved ? (
                    <div style={{ marginTop: '2.5rem', textAlign: 'center', background: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>Pronto para iniciar seu projeto?</h3>
                        <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem', lineHeight: '1.5' }}>
                            Aprove a ordem de serviço agora mesmo para garantirmos os seus materiais e darmos início à produção com excelência.
                        </p>
                        <button
                            onClick={handleApprove}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#fff',
                                border: 'none',
                                padding: '1.25rem 3rem',
                                borderRadius: '12px',
                                fontSize: '1.15rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <FiCheckCircle size={24} /> Dar Aceite na Proposta
                        </button>
                        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>* O Aceite registrará a aprovação no nosso sistema e gerará as faturas pertinentes.</p>
                    </div>
                ) : (
                    <div style={{ marginTop: '2.5rem', textAlign: 'center', background: '#ecfdf5', padding: '2.5rem', borderRadius: '12px', border: '2px solid #10b981', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ background: '#10b981', color: '#fff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
                            <FiCheckCircle size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', color: '#065f46', marginBottom: '0.75rem' }}>Proposta Aprovada com Sucesso! 🎉</h3>
                        <p style={{ color: '#047857', marginBottom: '2.5rem', fontWeight: 500, fontSize: '1.1rem', maxWidth: '650px' }}>
                            Agradecemos pela confiança! Como próximo passo, e para agilizar imediatamente a produção na fábrica, finalize o pagamento da entrada ou sinal usando a chave Pix abaixo.
                        </p>

                        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '450px' }}>
                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#092147', fontWeight: 700, fontSize: '1.2rem' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7L12 12L21 7L12 2Z" fill="#32BCAD" /><path d="M3 17L12 22L21 17" stroke="#32BCAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Pagamento Automático Pix
                            </div>

                            {/* Mock QR CODE Image using a dummy generic payload for PIX visual representation */}
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021126360014br.gov.bcb.pix0114000000000000005204000053039865802BR5913Empresa%20Teste6009SAO%20PAULO62070503***6304ED11" alt="QR Code Pix" style={{ width: '220px', height: '220px', borderRadius: '12px', border: '3px solid #f1f5f9', padding: '0.5rem', marginBottom: '1.5rem' }} />

                            <div style={{ width: '100%', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', textAlign: 'left', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Código Pix (Copia e Cola)</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        readOnly
                                        value="00020101021126360014br.gov.bcb.pix...5913Empresa..."
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.9rem', fontFamily: 'monospace' }}
                                    />
                                    <button
                                        onClick={() => { navigator.clipboard.writeText("00020101021126360014br.gov.bcb.pix0114000000000000005204000053039865802BR5913Empresa%20Teste6009SAO%20PAULO62070503***6304ED11"); toast.success("Código Copiado com Sucesso!"); }}
                                        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 1.5rem', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                                    >
                                        Copiar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Footer style={{ marginTop: '3rem' }}>
                    Proposta gerada via Sistema de Comunicação Visual. Os valores acima possuem validade até a data informada no cabeçalho.
                </Footer>
            </PropostaContainer>

            {/* Chatbot Integration */}
            <ChatIA nomeCliente={proposta.cliente} />
        </div>
    );
}
