import styled from 'styled-components';

// ─── Layout ───────────────────────────────────────────────────────────────────
export const PageWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    background: ${(p) => p.theme.background};
`;

// ─── Painel Esquerdo (Branding) ───────────────────────────────────────────────
export const LeftPanel = styled.aside`
    display: none;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    width: 45%;
    background: linear-gradient(145deg, ${(p) => p.theme.primary900} 0%, ${(p) => p.theme.primary600} 60%, ${(p) => p.theme.primary400} 100%);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -120px;
        right: -120px;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.04);
        pointer-events: none;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -80px;
        left: -80px;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.04);
        pointer-events: none;
    }

    @media (min-width: 900px) {
        display: flex;
    }
`;

export const BrandArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const BrandLogo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const BrandTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;

    span {
        color: ${(p) => p.theme.secundary400};
    }
`;

export const BrandSubtitle = styled.p`
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
    max-width: 360px;
`;

export const FeatureList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-bottom: 1rem;
`;

export const FeatureItem = styled.li`
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
    letter-spacing: 0.2px;
`;

// ─── Painel Direito (Formulário) ──────────────────────────────────────────────
export const RightPanel = styled.main`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
`;

export const FormCard = styled.div`
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
`;

export const FormHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

export const FormTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    color: ${(p) => p.theme.gray900};
    letter-spacing: -0.5px;
`;

export const FormSubtitle = styled.p`
    font-size: 0.95rem;
    color: ${(p) => p.theme.gray600};
`;

// ─── Campos ───────────────────────────────────────────────────────────────────
export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
`;

export const InputLabel = styled.label`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${(p) => p.theme.gray800};
`;

export const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const InputIcon = styled.span`
    position: absolute;
    left: 14px;
    color: ${(p) => p.theme.gray500};
    display: flex;
    align-items: center;
    pointer-events: none;
`;

export const StyledInput = styled.input`
    width: 100%;
    height: 48px;
    padding: 0 3rem 0 2.75rem;
    border: 1.5px solid ${(p) => p.theme.gray200};
    border-radius: 10px;
    font-size: 0.95rem;
    color: ${(p) => p.theme.gray900};
    background: ${(p) => p.theme.container};
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;

    &::placeholder {
        color: ${(p) => p.theme.gray400};
    }

    &:focus {
        border-color: ${(p) => p.theme.primary500};
        box-shadow: 0 0 0 3px ${(p) => p.theme.primary300}33;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const TogglePassword = styled.button`
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: ${(p) => p.theme.gray500};
    display: flex;
    align-items: center;
    transition: color 0.2s;

    &:hover {
        color: ${(p) => p.theme.gray800};
    }
`;

export const ForgotLink = styled.a`
    display: block;
    text-align: right;
    font-size: 0.83rem;
    color: ${(p) => p.theme.primary600};
    font-weight: 500;
    margin-top: -0.5rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: ${(p) => p.theme.primary800};
        text-decoration: underline;
    }
`;

export const SubmitButton = styled.button`
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, ${(p) => p.theme.primary600}, ${(p) => p.theme.primary500});
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px ${(p) => p.theme.primary500}55;

    &:hover:not(:disabled) {
        opacity: 0.92;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px ${(p) => p.theme.primary500}66;
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
    }
`;

export const Footer = styled.p`
    text-align: center;
    font-size: 0.8rem;
    color: ${(p) => p.theme.gray500};
    margin-top: 0.5rem;
`;
