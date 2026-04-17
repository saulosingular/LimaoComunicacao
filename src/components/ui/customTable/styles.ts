'use client';

import styled from 'styled-components';

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: ${(props) => props.theme.container};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid ${(props) => props.theme.gray200};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const THead = styled.thead`
  background-color: ${(props) => props.theme.gray150};
  border-bottom: 2px solid ${(props) => props.theme.gray200};
`;

export const TBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${(props) => props.theme.gray200};
    transition: background-color 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: ${(props) => props.theme.gray150};
    }
  }
`;

export const TH = styled.th<{ $width?: string }>`
  padding: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => props.theme.gray700};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: ${(props) => props.$width || 'auto'};
`;

export const TD = styled.td`
  padding: 1rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.gray900};
  vertical-align: middle;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${(props) => props.theme.gray500};
  font-size: 0.95rem;
`;
