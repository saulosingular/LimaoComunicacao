import React from 'react';
import { FiPlus, FiSend, FiMessageCircle, FiEdit3, FiBarChart2 } from 'react-icons/fi';
import { CardBase, CardHeader, CardTitle } from '../styles';
import { ActionList, ActionItem, ActionIcon, ActionText, ActionTitle, ActionSubtitle } from './styles';

interface IAcoesRapidasData {
    rascunhos: number;
    followupSubtitle: string;
    relatorioMes: string;
}

interface IAcoesRapidasCardProps {
    data: IAcoesRapidasData;
}

export function AcoesRapidasCard({ data }: IAcoesRapidasCardProps) {
    return (
        <CardBase>
            <CardHeader>
                <CardTitle>
                    <FiPlus color="#F59E0B" />
                    Ações Rápidas
                </CardTitle>
            </CardHeader>

            <ActionList>
                <ActionItem>
                    <ActionIcon $bg="#EEF2FF" $color="#3B82F6">
                        <FiSend />
                    </ActionIcon>
                    <ActionText>
                        <ActionTitle>Enviar Orçamento</ActionTitle>
                        <ActionSubtitle>{data.rascunhos} rascunhos prontos para envio</ActionSubtitle>
                    </ActionText>
                </ActionItem>

                <ActionItem>
                    <ActionIcon $bg="#ECFDF5" $color="#10B981">
                        <FiMessageCircle />
                    </ActionIcon>
                    <ActionText>
                        <ActionTitle>Follow-up WhatsApp</ActionTitle>
                        <ActionSubtitle>{data.followupSubtitle}</ActionSubtitle>
                    </ActionText>
                </ActionItem>

                <ActionItem>
                    <ActionIcon $bg="#FFFBEB" $color="#F59E0B">
                        <FiEdit3 />
                    </ActionIcon>
                    <ActionText>
                        <ActionTitle>Novo Orçamento</ActionTitle>
                        <ActionSubtitle>Usar template de produto</ActionSubtitle>
                    </ActionText>
                </ActionItem>

                <ActionItem>
                    <ActionIcon $bg="#F3F4F6" $color="#6B7280">
                        <FiBarChart2 />
                    </ActionIcon>
                    <ActionText>
                        <ActionTitle>Ver Relatório Mensal</ActionTitle>
                        <ActionSubtitle>Performance de {data.relatorioMes}</ActionSubtitle>
                    </ActionText>
                </ActionItem>
            </ActionList>
        </CardBase>
    );
}
