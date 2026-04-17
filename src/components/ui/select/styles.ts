'use client';

import styled from 'styled-components';

export const SelectContainer = styled.div<{ $widthFull?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: ${(props) => (props.$widthFull ? '100%' : 'auto')};
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => props.theme.gray800};
`;

export const SelectElement = styled.select<{ $hasError?: boolean }>`
  background: ${(props) => props.theme.container};
  border: 1px solid ${(props) => (props.$hasError ? props.theme.danger : props.theme.gray300)};
  border-radius: 6px;
  padding: 0 0.75rem;
  height: 42px;
  color: ${(props) => props.theme.gray900};
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;

  &:focus {
    border-color: ${(props) => (props.$hasError ? props.theme.danger : props.theme.primary500)};
    box-shadow: 0 0 0 2px ${(props) => (props.$hasError ? 'rgba(220, 53, 69, 0.2)' : 'rgba(0, 166, 80, 0.2)')};
  }

  /* Para tirar aparência padrão em alguns navegadores, melhor usar um SVG custom, 
     mas o select nativo já quebra o galho em um MVP */
  
  option {
    color: ${(props) => props.theme.gray900};
    background: ${(props) => props.theme.container};
  }
`;

export const ErrorText = styled.span`
  font-size: 0.8rem;
  color: ${(props) => props.theme.danger};
`;
