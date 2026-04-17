import styled from 'styled-components';

export const ProducaoContainer = styled.div`
    max-width: 1000px;
    margin: 2rem auto;
    background: #fff;
    border: 1px solid #ccc;
    font-family: 'Inter', sans-serif;
    color: #111;

    @media print {
        max-width: 100%;
        margin: 0;
        border: none;
    }
`;

export const ProducaoHeader = styled.div`
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #000;

    @media print {
        padding: 0 0 1rem 0;
    }
`;

export const TituloHeader = styled.div`
    h1 {
        font-size: 1.6rem;
        margin-bottom: 0.25rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #000;
    }

    p {
        color: #444;
        font-size: 1rem;
        font-weight: 500;
    }
`;

export const PrintButtonContainer = styled.div`
    button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1.5rem;
        background: #000;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
            background: #333;
        }
    }

    @media print {
        display: none;
    }
`;

export const InfoList = styled.div`
    padding: 1rem 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    border-bottom: 1px solid #ccc;

    @media print {
        padding: 1rem 0;
        border-bottom: 2px solid #000;
    }
`;

export const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    label {
        font-size: 0.75rem;
        color: #555;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    span {
        font-size: 1.05rem;
        color: #000;
        font-weight: 600;
    }
`;

export const ItensSection = styled.div`
    padding: 2rem;

    @media print {
        padding: 1.5rem 0;
    }
`;

export const ItemCard = styled.div`
    border: 1px solid #000;
    margin-bottom: 2rem;
    background: #fff;
    page-break-inside: avoid;
`;

export const ItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f4f4f4;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #000;

    h3 {
        font-size: 1.15rem;
        color: #000;
        font-weight: 800;
        text-transform: uppercase;
        margin: 0;
    }
`;

export const TagGroup = styled.div`
    display: flex;
    gap: 1rem;

    .dimensao, .quantidade { 
        color: #000; 
        font-weight: 700;
        font-size: 1.05rem;
        display: flex;
        align-items: center;
    }
    
    .quantidade::before {
        content: 'Qtd: ';
        font-size: 0.8rem;
        color: #555;
        margin-right: 4px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .dimensao::before {
        content: 'Medidas: ';
        font-size: 0.8rem;
        color: #555;
        margin-right: 4px;
        font-weight: 600;
        text-transform: uppercase;
    }
`;

export const RespostasTable = styled.div`
    table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
            text-align: left;
            padding: 0.6rem 1rem;
            border-bottom: 1px solid #eee;
            font-size: 0.95rem;
        }

        th {
            color: #444;
            font-weight: 600;
            width: 35%;
            border-right: 1px solid #eee;
        }

        td {
            color: #000;
            font-weight: 700;
        }
    }
`;

export const DescricaoBlock = styled.div`
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #eee;
    
    strong {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.8rem;
        color: #555;
        text-transform: uppercase;
    }

    p {
        color: #000;
        font-size: 0.95rem;
        line-height: 1.5;
        margin: 0;
        font-weight: 500;
    }
`;

export const ObservacaoBlock = styled(DescricaoBlock)`
    border-left: 5px solid #000;
    background: #fbfbfb;

    strong { 
        color: #000; 
        font-weight: 800; 
    }
    p { 
        color: #000; 
        font-weight: 700; 
    }
`;

export const SubItensList = styled.div`
    padding: 0.75rem 1rem;
    background: #fafafa;
    border-top: 1px solid #000;

    h4 {
        font-size: 0.8rem;
        color: #000;
        text-transform: uppercase;
        font-weight: 800;
        margin-bottom: 0.5rem;
        margin-top: 0;
    }

    ul {
        list-style: square inside;
        padding: 0;
        margin: 0;

        li {
            color: #000;
            font-weight: 600;
            margin-bottom: 0.25rem;
            font-size: 0.95rem;
        }
    }
`;

export const Footer = styled.div`
    padding: 1.5rem 2rem;
    text-align: center;
    color: #000;
    font-size: 0.75rem;
    border-top: 2px solid #000;
    text-transform: uppercase;
    font-weight: 600;

    @media print {
        padding: 1rem 0;
    }
`;
