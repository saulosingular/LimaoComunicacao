import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: ${(props) => props.theme.container};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid ${(props) => props.theme.gray200};
`;

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: ${(props) => props.theme.primary600};
  margin-bottom: 1rem;
  border-bottom: 2px solid ${(props) => props.theme.gray200};
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Row = styled.div`
  display: flex;
  gap: 1.5rem;
  
  > div {
    flex: 1;
  }
`;

export const SectionCard = styled.div`
  background-color: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.gray200};
  padding: 1.5rem;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CampoCard = styled.div`
  background-color: ${(props) => props.theme.container};
  border: 1px dashed ${(props) => props.theme.gray300};
  padding: 1rem;
  border-radius: 6px;
  position: relative;
  margin-top: 0.5rem;
`;

export const RemoveButtonAbsolute = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${(props) => props.theme.danger};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

export const FlexEndRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;
