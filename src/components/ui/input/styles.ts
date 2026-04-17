'use client';

import styled from 'styled-components';

export const Container = styled.div<{ $widthFull?: boolean }>`
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

export const ContentContainer = styled.div<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.container};
  border: 1px solid ${(props) => (props.$hasError ? props.theme.danger : props.theme.gray300)};
  border-radius: 6px;
  padding: 0 0.75rem;
  height: 42px;
  transition: all 0.2s;

  &:focus-within {
    border-color: ${(props) => (props.$hasError ? props.theme.danger : props.theme.primary500)};
    box-shadow: 0 0 0 2px ${(props) => (props.$hasError ? 'rgba(220, 53, 69, 0.2)' : 'rgba(0, 166, 80, 0.2)')};
  }

  svg {
    color: ${(props) => props.theme.gray500};
    margin-right: 0.5rem;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${(props) => props.theme.gray900};
    font-size: 0.95rem;
    height: 100%;

    &::placeholder {
      color: ${(props) => props.theme.gray400};
    }
  }
`;

export const ErrorText = styled.span`
  font-size: 0.8rem;
  color: ${(props) => props.theme.danger};
  margin-top: 0.1rem;
`;
