'use client';

import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
`;

export const ModalContainer = styled.div<{ $width?: string }>`
  background-color: ${(props) => props.theme.container};
  border-radius: 8px;
  width: ${(props) => props.$width || '500px'};
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeaderContainer = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.gray200};

  h2 {
    font-size: 1.15rem;
    font-weight: 600;
    color: ${(props) => props.theme.gray900};
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.gray500};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.danger};
  }
`;

export const ModalContentContainer = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooterContainer = styled.div`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid ${(props) => props.theme.gray200};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;
