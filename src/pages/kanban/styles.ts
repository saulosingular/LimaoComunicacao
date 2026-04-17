'use client';
import styled from 'styled-components';

export const KanbanContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  width: 100%;
  overflow: hidden;
`;

export const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h2`
  color: #1e293b;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const BoardScrollArea = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  padding-bottom: 1rem;

  &::-webkit-scrollbar {
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
`;

export const ColumnContainer = styled.div<{ $isDraggingOver?: boolean }>`
  min-width: 320px;
  max-width: 320px;
  background: ${({ $isDraggingOver }) => $isDraggingOver ? '#f1f5f9' : '#f8fafc'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
  height: 100%;
`;

export const ColumnHeader = styled.div<{ $color: string }>`
  padding: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid ${({ $color }) => $color};
  color: #1e293b;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #ffffff;

  .badge {
    background: ${({ $color }) => $color}20;
    color: ${({ $color }) => $color};
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
  }
`;

export const ColumnBody = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

// Card Components

export const OSCard = styled.div<{ $isDragging?: boolean }>`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  cursor: grab;
  box-shadow: ${({ $isDragging }) => ($isDragging ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)')};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
  
  &:hover {
    border-color: #3b82f6;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;

  .os-number {
    font-weight: 700;
    color: #0e2d5c;
    font-size: 0.9rem;
  }
  
  .os-date {
    font-size: 0.75rem;
    color: #64748b;
  }
`;

export const CardTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;

  .tag {
    font-size: 0.75rem;
    background: #f1f5f9;
    color: #475569;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .price {
    font-weight: 600;
    color: #10b981;
    font-size: 0.95rem;
  }
`;
