import styled from 'styled-components';

export const ClientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ClientItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${(props) => props.theme.gray200};

  &:last-child {
    border-bottom: none;
  }
`;

export const ClientAvatar = styled.div<{ $bg: string; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

export const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
`;

export const ClientName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(props) => props.theme.gray900};
`;

export const ClientOSInfo = styled.span`
  font-size: 0.8rem;
  color: ${(props) => props.theme.gray500};
`;

export const ClientValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
`;

export const ClientAmount = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${(props) => props.theme.info};
`;

export const StatusTag = styled.div<{ $status: string }>`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  ${(props) => {
    switch (props.$status) {
      case 'Urgente':
        return `
          color: ${props.theme.danger};
          background-color: #FEE2E2;
          &::before { background-color: ${props.theme.danger}; }
        `;
      case 'Em andamento':
        return `
          color: ${props.theme.warning};
          background-color: #FEF3C7;
          &::before { background-color: ${props.theme.warning}; }
        `;
      case 'Aprovado':
        return `
          color: ${props.theme.success};
          background-color: #D1FAE5;
          &::before { background-color: ${props.theme.success}; }
        `;
      default:
        return `
          color: ${props.theme.gray600};
          background-color: ${props.theme.gray200};
          &::before { background-color: ${props.theme.gray600}; }
        `;
    }
  }}
`;
