'use client';

import React from 'react';
import { TableWrapper, StyledTable, THead, TBody, TH, TD, EmptyState } from './styles';

export interface ITableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    width?: string;
    className?: string;
}

interface ICustomTableProps<T> {
    columns: ITableColumn<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
}

export function CustomTable<T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
    emptyMessage = 'Nenhum registro encontrado.'
}: ICustomTableProps<T>) {

    if (!data || data.length === 0) {
        return (
            <TableWrapper>
                <EmptyState>{emptyMessage}</EmptyState>
            </TableWrapper>
        );
    }

    return (
        <TableWrapper>
            <StyledTable>
                <THead>
                    <tr>
                        {columns.map((col) => (
                            <TH key={String(col.key)} $width={col.width} className={col.className}>
                                {col.label}
                            </TH>
                        ))}
                    </tr>
                </THead>
                <TBody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map((col) => {
                                const value = col.key !== 'actions' ? row[col.key as keyof T] : undefined;
                                return (
                                    <TD key={String(col.key)} className={col.className}>
                                        {col.render ? col.render(value as any, row) : String(value)}
                                    </TD>
                                );
                            })}
                        </tr>
                    ))}
                </TBody>
            </StyledTable>
        </TableWrapper>
    );
}
