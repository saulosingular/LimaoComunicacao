import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  
  /* Gradiente subtil ou fundo que se misture com a cor do container */
  background-color: ${(props) => props.theme.background};
`;

export const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 300px;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const BottomRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const CardBase = styled.div`
  background-color: ${(props) => props.theme.container};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.gray900};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CardSubtitle = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.gray600};
`;
