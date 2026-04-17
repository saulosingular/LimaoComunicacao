import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

export const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  background-color: ${(props) => props.theme.container};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid ${(props) => props.theme.gray200};

  > div {
    min-width: 250px;
  }
`;

export const TableActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;

  button {
    padding: 0.5rem;
  }
`;
