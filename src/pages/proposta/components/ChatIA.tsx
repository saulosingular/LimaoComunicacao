'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiSend, FiUser } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

interface IChatIAProps {
    nomeCliente: string;
}

export function ChatIA({ nomeCliente }: IChatIAProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-Open the chat after 2.5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasOpenedBefore) {
                setIsOpen(true);
                setHasOpenedBefore(true);
                setMessages([{
                    role: 'ai',
                    text: `Olá ${nomeCliente.split(' ')[0]}! 👋\nSou o assistente inteligente de vendas e vi que você está analisando nossa proposta.\n\nPosso te ajudar tirando dúvidas sobre os materiais ou prazos?`
                }]);
            }
        }, 2500);
        return () => clearTimeout(timer);
    }, [nomeCliente, hasOpenedBefore]);

    // Auto-scroll to bottom format
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');

        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        // Mocked AI Response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: 'Interessante! Se você estiver pronto para avançar, basta rolar até o fim da proposta e clicar no botão verde "Aprovar Serviço". O sistema já vai liberar a chave Pix de entrada e passaremos o seu pedido para produção em estufa hoje mesmo! 🚀'
            }]);
        }, 1800);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Botão Flutuante */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: '#3b82f6',
                        color: '#fff',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <FiMessageSquare size={28} />
                </button>
            )}

            {/* Janela de Chat */}
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <style>{`
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>

                    {/* Chat Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                        padding: '1rem',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                                <BsRobot size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Assistente Virtual</h3>
                                <span style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div style={{
                        flex: 1,
                        background: '#f8fafc',
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                                gap: '8px'
                            }}>
                                {msg.role === 'ai' && (
                                    <div style={{ background: '#e2e8f0', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <BsRobot size={14} color="#475569" />
                                    </div>
                                )}

                                <div style={{
                                    background: msg.role === 'user' ? '#3b82f6' : '#fff',
                                    color: msg.role === 'user' ? '#fff' : '#334155',
                                    padding: '0.75rem 1rem',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    maxWidth: '75%',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    whiteSpace: 'pre-wrap',
                                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0'
                                }}>
                                    {msg.text}
                                </div>

                                {msg.role === 'user' && (
                                    <div style={{ background: '#bfdbfe', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FiUser size={14} color="#1d4ed8" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
                                <div style={{ background: '#e2e8f0', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BsRobot size={14} color="#475569" />
                                </div>
                                <div style={{
                                    background: '#fff', padding: '0.75rem 1rem', borderRadius: '16px 16px 16px 4px', border: '1px solid #e2e8f0', display: 'flex', gap: '4px'
                                }}>
                                    <span style={{ width: '6px', height: '6px', background: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                                    <span style={{ width: '6px', height: '6px', background: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                                    <span style={{ width: '6px', height: '6px', background: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                                </div>
                                <style>{`
                                    @keyframes bounce { 
                                        0%, 100% { transform: translateY(0); }
                                        50% { transform: translateY(-4px); }
                                    }
                                `}</style>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSend} style={{
                        padding: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        gap: '0.5rem',
                        background: '#fff'
                    }}>
                        <input
                            title="chat"
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Escreva sua mensagem..."
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '24px',
                                border: '1px solid #cbd5e1',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                            onFocus={e => e.target.style.borderColor = '#3b82f6'}
                            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                        />
                        <button
                            type="submit"
                            style={{
                                background: '#3b82f6',
                                color: '#fff',
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <FiSend size={18} style={{ marginLeft: '-2px' }} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
