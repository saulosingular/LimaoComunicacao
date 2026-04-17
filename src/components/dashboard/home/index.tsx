'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { useOrcamento } from '@/hooks/useOrcamento';
import { configuracaoEmpresaService } from '@/shared/services';
import type { IOrcamentoDTO } from '@/shared/interfaces/orcamento';
import { Container, TopRow, BottomRow } from './styles';

// Componentes do Dashboard (a serem criados)
import { ReceitaCard } from './ReceitaCard';
import { FunilCard } from './FunilCard';
import { AcoesRapidasCard } from './AcoesRapidasCard';
import { ClientesCard } from './ClientesCard';
import { TaxaConversaoCard } from './TaxaConversaoCard';

interface IClienteResumo {
    id: string;
    name: string;
    osInfo: string;
    amount: string;
    status: 'Urgente' | 'Em andamento' | 'Aprovado';
    color: string;
    colorText?: string;
}

const BRL_CURRENCY = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const MONTH_FORMATTER = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

const APPROVED_STATUSES = new Set(['APROVADO', 'PRODUCAO', 'INSTALACAO', 'CONCLUIDO']);
const PENDING_STATUSES = new Set(['RASCUNHO', 'CRIAÇÃO', 'ENVIADO']);

function formatCurrency(value: number): string {
    return BRL_CURRENCY.format(value || 0);
}

function parseDateOnly(value: string): Date {
    return new Date(`${value}T00:00:00`);
}

function isSameMonth(baseDate: Date, value: string): boolean {
    const date = parseDateOnly(value);
    return date.getFullYear() === baseDate.getFullYear() && date.getMonth() === baseDate.getMonth();
}

function monthRef(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function daysDiff(fromDate: Date, toDate: Date): number {
    const diffMs = toDate.getTime() - fromDate.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function buildClientesResumo(
    orcamentosAbertos: IOrcamentoDTO[],
    statusLabelByCode: Map<string, string>,
    today: Date,
): IClienteResumo[] {
    const palette = ['#8B5CF6', '#10B981', '#1E3A8A', '#6EE7B7'];

    const grouped = new Map<string, IOrcamentoDTO[]>();
    for (const os of orcamentosAbertos) {
        const key = os.cliente || 'Sem Cliente';
        const list = grouped.get(key) ?? [];
        list.push(os);
        grouped.set(key, list);
    }

    return [...grouped.entries()]
        .map(([cliente, lista], index) => {
            const total = lista.reduce((acc, item) => acc + (item.valorTotalOrcamento || 0), 0);
            const osNumbers = lista
                .map((item) => item.numeroOs)
                .filter((value): value is number => typeof value === 'number')
                .sort((a, b) => a - b);

            const labels = [...new Set(lista.map((item) => statusLabelByCode.get(item.status) || item.status))];

            const hasUrgente = lista.some((item) => {
                if (item.status !== 'ENVIADO') return false;
                if (item.followupRealizado) return false;
                const dias = daysDiff(parseDateOnly(item.dataCriacao), today);
                return dias >= 3;
            });

            const allAprovado = lista.every((item) => APPROVED_STATUSES.has(item.status));

            const status: 'Urgente' | 'Em andamento' | 'Aprovado' = hasUrgente
                ? 'Urgente'
                : allAprovado
                    ? 'Aprovado'
                    : 'Em andamento';

            const osLabel = osNumbers.length > 1
                ? `OS #${osNumbers.join(', #')}`
                : `OS #${osNumbers[0] || '?'}`;

            const osInfo = `${osLabel} - ${labels.join(' + ')}`;

            return {
                id: getInitials(cliente),
                name: cliente,
                osInfo,
                amount: formatCurrency(total),
                status,
                color: palette[index % palette.length],
                colorText: index % palette.length === 3 ? '#047857' : '#FFFFFF',
                total,
            };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 4)
        .map(({ total: _total, ...item }) => item);
}

export function DashboardHome() {
    const { setTitlePage } = useDashboard();
    const orcamentos = useOrcamento((state) => state.orcamentos).filter((item) => !item.arquivado);
    const statusOptions = useOrcamento((state) => state.statusOptions);
    const fetchOrcamentos = useOrcamento((state) => state.fetchOrcamentos);
    const fetchStatusOptions = useOrcamento((state) => state.fetchStatusOptions);

    const [metaMensal, setMetaMensal] = useState<number>(0);

    useEffect(() => {
        setTitlePage('Dashboard');
        fetchOrcamentos({ arquivado: false });
        fetchStatusOptions();

        const now = new Date();
        configuracaoEmpresaService.getMetaMensal(monthRef(now)).then((meta) => {
            setMetaMensal(meta ?? 0);
        });
    }, [setTitlePage, fetchOrcamentos, fetchStatusOptions]);

    const dashboardData = useMemo(() => {
        const now = new Date();
        const currentMonthOrcamentos = orcamentos.filter((item) => isSameMonth(now, item.dataCriacao));

        const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthOrcamentos = orcamentos.filter((item) => isSameMonth(previousMonthDate, item.dataCriacao));

        const totalMes = currentMonthOrcamentos.reduce((acc, item) => acc + (item.valorTotalOrcamento || 0), 0);
        const totalMesAnterior = previousMonthOrcamentos.reduce((acc, item) => acc + (item.valorTotalOrcamento || 0), 0);

        const faturado = currentMonthOrcamentos
            .filter((item) => APPROVED_STATUSES.has(item.status))
            .reduce((acc, item) => acc + (item.valorTotalOrcamento || 0), 0);

        const emPipeline = currentMonthOrcamentos
            .filter((item) => PENDING_STATUSES.has(item.status))
            .reduce((acc, item) => acc + (item.valorTotalOrcamento || 0), 0);

        const totalCount = currentMonthOrcamentos.length;
        const ticketMedio = totalCount ? totalMes / totalCount : 0;

        const comparacaoPercentual = totalMesAnterior > 0
            ? Math.round(((totalMes - totalMesAnterior) / totalMesAnterior) * 100)
            : 0;

        const statusLabelByCode = new Map(statusOptions.map((item) => [item.id, item.label]));

        const criados = currentMonthOrcamentos.length;
        const enviados = currentMonthOrcamentos.filter((item) => item.status === 'ENVIADO').length;
        const visualizados = currentMonthOrcamentos.filter((item) => item.followupRealizado).length;
        const aprovados = currentMonthOrcamentos.filter((item) => APPROVED_STATUSES.has(item.status)).length;
        const perdidos = currentMonthOrcamentos.filter((item) => item.status === 'REJEITADO').length;

        const funilMax = Math.max(1, criados);
        const funilData = [
            { label: 'Criados', value: criados, color: '#4F4F4F', width: (criados / funilMax) * 100, suffix: ' orçamentos' },
            { label: 'Enviados', value: enviados, color: '#3B82F6', width: (enviados / funilMax) * 100, suffix: ' enviados' },
            { label: 'Visualizados', value: visualizados, color: '#8B5CF6', width: (visualizados / funilMax) * 100, suffix: ' lidos' },
            { label: 'Aprovados', value: aprovados, color: '#10B981', width: (aprovados / funilMax) * 100, suffix: ' aprovados' },
            { label: 'Perdidos', value: perdidos, color: '#EF4444', width: (perdidos / funilMax) * 100, suffix: '' },
        ];

        const pendentes = Math.max(0, criados - aprovados - perdidos);
        const taxaConversaoData = [
            { name: 'Convertidos', value: aprovados, color: '#10B981' },
            { name: 'Pendentes', value: pendentes, color: '#F59E0B' },
            { name: 'Perdidos', value: perdidos, color: '#EF4444' },
        ];

        const mesLabel = MONTH_FORMATTER
            .format(now)
            .replace(/^./, (char) => char.toUpperCase());

        const orcamentosAbertos = orcamentos.filter((item) => !['CONCLUIDO', 'REJEITADO'].includes(item.status));
        const clientes = buildClientesResumo(orcamentosAbertos, statusLabelByCode, now);

        const rascunhos = orcamentos.filter((item) => item.status === 'RASCUNHO').length;
        const pendingFollowup = orcamentos
            .filter((item) => item.status === 'ENVIADO' && !item.followupRealizado)
            .sort((a, b) => parseDateOnly(a.dataCriacao).getTime() - parseDateOnly(b.dataCriacao).getTime());

        const followupItem = pendingFollowup[0];
        const followupSubtitle = followupItem
            ? `${followupItem.cliente} - ${daysDiff(parseDateOnly(followupItem.dataCriacao), now)} dias sem resposta`
            : 'Nenhum follow-up pendente';

        return {
            receita: {
                mes: mesLabel,
                totalReceita: formatCurrency(totalMes),
                comparacaoPercentual: Math.abs(comparacaoPercentual),
                valorMesAnterior: formatCurrency(totalMesAnterior),
                comparacaoPositiva: comparacaoPercentual >= 0,
                faturado: formatCurrency(faturado),
                emPipeline: formatCurrency(emPipeline),
                ticketMedio: formatCurrency(ticketMedio),
                metaMensal: formatCurrency(metaMensal),
            },
            funilData,
            taxaConversaoData,
            clientes,
            acoesRapidas: {
                rascunhos,
                followupSubtitle,
                relatorioMes: mesLabel.toLowerCase(),
            },
        };
    }, [metaMensal, orcamentos, statusOptions]);

    return (
        <Container>
            <TopRow>
                <ReceitaCard data={dashboardData.receita} />
                <FunilCard data={dashboardData.funilData} />
                <AcoesRapidasCard data={dashboardData.acoesRapidas} />
            </TopRow>
            <BottomRow>
                <ClientesCard clientes={dashboardData.clientes} />
                <TaxaConversaoCard data={dashboardData.taxaConversaoData} />
            </BottomRow>
        </Container>
    );
}
