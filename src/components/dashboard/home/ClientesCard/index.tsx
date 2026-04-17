import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { CardBase, CardHeader, CardTitle } from '../styles';
import {
    ClientList,
    ClientItem,
    ClientAvatar,
    ClientInfo,
    ClientName,
    ClientOSInfo,
    ClientValues,
    ClientAmount,
    StatusTag
} from './styles';

interface IClienteCardItem {
    id: string;
    name: string;
    osInfo: string;
    amount: string;
    status: 'Urgente' | 'Em andamento' | 'Aprovado';
    color: string;
    colorText?: string;
}

interface IClientesCardProps {
    clientes: IClienteCardItem[];
}

export function ClientesCard({ clientes }: IClientesCardProps) {
    return (
        <CardBase>
            <CardHeader>
                <CardTitle>
                    <FiUsers color="#4F4F4F" />
                    Clientes com OS Abertas
                </CardTitle>
                <span style={{ fontSize: '0.8rem', color: '#3B82F6', cursor: 'pointer', fontWeight: 600 }}>Ver CRM →</span>
            </CardHeader>

            <ClientList>
                {clientes.map((client, idx) => (
                    <ClientItem key={idx}>
                        <ClientAvatar $bg={client.color} $color={client.colorText || '#fff'}>
                            {client.id}
                        </ClientAvatar>
                        <ClientInfo>
                            <ClientName>{client.name}</ClientName>
                            <ClientOSInfo>{client.osInfo}</ClientOSInfo>
                        </ClientInfo>
                        <ClientValues>
                            <ClientAmount>{client.amount}</ClientAmount>
                            <StatusTag $status={client.status}>{client.status}</StatusTag>
                        </ClientValues>
                    </ClientItem>
                ))}
            </ClientList>
        </CardBase>
    );
}
