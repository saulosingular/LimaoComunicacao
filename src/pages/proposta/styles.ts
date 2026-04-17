import styled from 'styled-components';

export const PropostaContainer = styled.div`
    max-width: 800px;
    margin: 3rem auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    overflow: hidden;
    font-family: 'Inter', sans-serif;
`;

export const PropostaHeader = styled.div`
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 3rem 2rem;
    color: #fff;
    text-align: center;
`;

export const EmpresaNome = styled.h1`
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
`;

export const InfoList = styled.div`
    padding: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-between;
    border-bottom: 1px solid #e2e8f0;
    background: #fafaf9;
`;

export const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    label {
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    span {
        font-size: 1.1rem;
        color: #0f172a;
        font-weight: 600;
    }
`;

export const ItensSection = styled.div`
    padding: 2rem;
`;

export const ItemCard = styled.div`
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    background: #fff;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
`;

export const ItemDetails = styled.div`
    flex: 1;

    h3 {
        font-size: 1.25rem;
        color: #0f172a;
        margin-bottom: 0.5rem;
    }

    p {
        font-size: 0.95rem;
        color: #475569;
        margin-bottom: 1rem;
        line-height: 1.5;
        max-width: 90%;
    }
`;

export const TagGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .dimensao { background: #f1f5f9; color: #475569; }
    .quantidade { background: #fef3c7; color: #b45309; }
`;

export const SubItensList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

export const SubItemTag = styled.span`
    background: #e0f2fe;
    color: #0369a1;
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
    border-radius: 9999px;
    font-weight: 600;
`;

export const ItemPrice = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    color: #10b981;
    display: flex;
    align-items: center;
    background: #f0fdf4;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    height: fit-content;
`;

export const TotalBanner = styled.div`
    background: #f8fafc;
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border-top: 1px solid #e2e8f0;

    span {
        font-size: 1rem;
        color: #64748b;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 500;
    }
    
    strong {
        font-size: 3rem;
        color: #0f172a;
        line-height: 1;
    }
`;

export const Footer = styled.div`
    padding: 2rem;
    text-align: center;
    color: #94a3b8;
    font-size: 0.9rem;
    background: #fff;
    border-top: 1px solid #e2e8f0;
`;
