import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

export interface IConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: IConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox>
        <Header>
          <FiAlertTriangle size={24} color="#ef4444" />
          <Title>{title}</Title>
        </Header>
        <Message>{message}</Message>
        <Footer>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" customColor="danger" onClick={onConfirm}>
            Excluir
          </Button>
        </Footer>
      </ModalBox>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

const ModalBox = styled.div`
  background: ${(props) => props.theme.container};
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.gray200};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${(props) => props.theme.gray900};
  font-weight: 600;
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
  color: ${(props) => props.theme.gray700};
  font-size: 0.95rem;
  line-height: 1.4;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;
