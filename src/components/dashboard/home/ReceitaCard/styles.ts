import styled from 'styled-components';

export const MainValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

export const MainValue = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.info}; /* Cor similar ao azul da imagem */
`;

export const ComparisonText = styled.span<{ $positive?: boolean }>`
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${(props) => props.$positive ? props.theme.gray500 : props.theme.danger};
  
  svg {
    color: ${(props) => props.$positive ? props.theme.success : props.theme.danger};
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: auto;
`;

export const GridItem = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ItemLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${(props) => props.theme.gray600};
  letter-spacing: 0.5px;
`;

export const ItemValue = styled.span<{ $color?: 'success' | 'info' | 'warning' | 'secondary' }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => {
    switch (props.$color) {
      case 'success': return props.theme.success;
      case 'info': return props.theme.info;
      case 'warning': return props.theme.warning;
      case 'secondary': return props.theme.secundary500;
      default: return props.theme.gray900;
    }
  }};
`;
