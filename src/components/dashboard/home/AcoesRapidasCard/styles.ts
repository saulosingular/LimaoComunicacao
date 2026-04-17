import styled from 'styled-components';

export const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
`;

export const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.gray200};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.primary400};
    background-color: ${(props) => props.theme.background};
    transform: translateY(-2px);
  }
`;

export const ActionIcon = styled.div<{ $bg: string; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  font-size: 1.2rem;
  flex-shrink: 0;
`;

export const ActionText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ActionTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.gray900};
`;

export const ActionSubtitle = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.gray600};
`;
