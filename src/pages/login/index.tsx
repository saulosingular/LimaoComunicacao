'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authService } from '@/shared/services';
import {
    PageWrapper,
    LeftPanel,
    BrandArea,
    BrandLogo,
    BrandTitle,
    BrandSubtitle,
    FeatureList,
    FeatureItem,
    RightPanel,
    FormCard,
    FormHeader,
    FormTitle,
    FormSubtitle,
    InputGroup,
    InputLabel,
    InputWrapper,
    InputIcon,
    StyledInput,
    TogglePassword,
    SubmitButton,
    ForgotLink,
    Footer,
} from './styles';

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !senha) {
            toast.warning('Preencha e-mail e senha.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await authService.signIn(email, senha);
            if (error) {
                toast.error('E-mail ou senha incorretos. Tente novamente.');
                return;
            }
            navigate('/');

        } catch {
            toast.error('Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            {/* ── Painel Esquerdo (Branding) ── */}
            <LeftPanel>
                <BrandArea>
                    <BrandLogo>
                        <FiZap size={36} />
                    </BrandLogo>
                    <BrandTitle>Poteito<span>OS</span></BrandTitle>
                    <BrandSubtitle>
                        Gestão completa de orçamentos e ordens de serviço para sua empresa de comunicação visual.
                    </BrandSubtitle>
                </BrandArea>

                <FeatureList>
                    <FeatureItem>✦ Geração de orçamentos por template</FeatureItem>
                    <FeatureItem>✦ Kanban de ordens de serviço</FeatureItem>
                    <FeatureItem>✦ Follow-up automático de clientes</FeatureItem>
                    <FeatureItem>✦ Controle de matéria prima e estoque</FeatureItem>
                </FeatureList>
            </LeftPanel>

            {/* ── Painel Direito (Formulário) ── */}
            <RightPanel>
                <FormCard>
                    <FormHeader>
                        <FormTitle>Bem-vindo de volta</FormTitle>
                        <FormSubtitle>Acesse sua conta para continuar</FormSubtitle>
                    </FormHeader>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* E-mail */}
                        <InputGroup>
                            <InputLabel htmlFor="email">E-mail</InputLabel>
                            <InputWrapper>
                                <InputIcon><FiMail size={18} /></InputIcon>
                                <StyledInput
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    disabled={loading}
                                />
                            </InputWrapper>
                        </InputGroup>

                        {/* Senha */}
                        <InputGroup>
                            <InputLabel htmlFor="senha">Senha</InputLabel>
                            <InputWrapper>
                                <InputIcon><FiLock size={18} /></InputIcon>
                                <StyledInput
                                    id="senha"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                                <TogglePassword
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </TogglePassword>
                            </InputWrapper>
                        </InputGroup>

                        <ForgotLink href="/esqueci-senha">Esqueci minha senha</ForgotLink>

                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </SubmitButton>
                    </form>

                    <Footer>
                        Problemas de acesso? Fale com o administrador.
                    </Footer>
                </FormCard>
            </RightPanel>
        </PageWrapper>
    );
}
