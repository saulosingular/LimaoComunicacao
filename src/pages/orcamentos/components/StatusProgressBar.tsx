'use client';

import React from 'react';
import styled from 'styled-components';

export type StatusOS = 'RASCUNHO' | 'ENVIADO' | 'APROVADO' | 'REJEITADO';

interface ProgressProps {
    status: StatusOS;
    onChangeStatus?: (newStatus: StatusOS) => void;
}

const steps: { value: StatusOS; label: string }[] = [
    { value: 'RASCUNHO', label: 'Rascunho / Em Digitação' },
    { value: 'ENVIADO', label: 'Enviado ao Cliente' },
    { value: 'APROVADO', label: 'Aprovado (OS Final)' },
    { value: 'REJEITADO', label: 'Perdido / Rejeitado' }
];

export function StatusProgressBar({ status, onChangeStatus }: ProgressProps) {
    const currentIndex = steps.findIndex(s => s.value === status);
    const isRejected = status === 'REJEITADO';

    return (
        <ProgressContainer>
            {steps.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                let colorType: 'completed' | 'active' | 'pending' | 'rejected' = 'pending';

                if (isActive && isRejected) colorType = 'rejected';
                else if (isCompleted && isRejected) colorType = 'rejected';
                else if (isCompleted) colorType = 'completed';
                else if (isActive) colorType = 'active';

                return (
                    <StepItem key={step.value} onClick={() => onChangeStatus && onChangeStatus(step.value)}>
                        <StepIndicator $colorType={colorType}>{index + 1}</StepIndicator>
                        <StepLabel $isActive={isActive || isCompleted} $isRejected={isRejected && (isActive || isCompleted)}>
                            {step.label}
                        </StepLabel>
                        {index < steps.length - 1 && <StepConnector $isCompleted={isCompleted} $isRejected={isRejected && isCompleted} />}
                    </StepItem>
                );
            })}
        </ProgressContainer>
    );
}

// Estilos
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 1.5rem 0 2.5rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const StepIndicator = styled.div<{ $colorType: 'completed' | 'active' | 'pending' | 'rejected' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 2;
  transition: all 0.3s;

  ${({ $colorType }) => {
        switch ($colorType) {
            case 'completed':
                return `background: #10b981; color: white; border: 2px solid #10b981;`;
            case 'active':
                return `background: white; color: #3b82f6; border: 2px solid #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);`;
            case 'rejected':
                return `background: #ef4444; color: white; border: 2px solid #ef4444;`;
            default:
                return `background: white; color: #94a3b8; border: 2px solid #cbd5e1;`;
        }
    }}
`;

const StepLabel = styled.span<{ $isActive: boolean; $isRejected: boolean }>`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
  color: ${({ $isActive, $isRejected }) =>
        $isRejected ? '#ef4444'
            : $isActive ? '#1f2937'
                : '#94a3b8'};
  text-align: center;
`;

const StepConnector = styled.div<{ $isCompleted: boolean; $isRejected: boolean }>`
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: ${({ $isCompleted, $isRejected }) =>
        $isRejected ? '#ef4444'
            : $isCompleted ? '#10b981'
                : '#cbd5e1'};
  z-index: 1;
`;
