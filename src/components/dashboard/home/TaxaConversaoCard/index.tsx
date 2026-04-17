import React from 'react';
import { FiPieChart } from 'react-icons/fi';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CardBase, CardHeader, CardTitle, CardSubtitle } from '../styles';
import {
    ChartContainer,
    CenterContent,
    CenterPercentage,
    CenterLabel,
    StatsContainer,
    StatItem,
    StatValue,
    StatLabel
} from './styles';

interface ITaxaConversaoItem {
    name: string;
    value: number;
    color: string;
}

interface ITaxaConversaoCardProps {
    data: ITaxaConversaoItem[];
}

export function TaxaConversaoCard({ data }: ITaxaConversaoCardProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    const convertidos = data.find(item => item.name === 'Convertidos')?.value || 0;
    const percentage = total > 0 ? Math.round((convertidos / total) * 100) : 0;

    return (
        <CardBase>
            <CardHeader>
                <CardTitle>
                    <FiPieChart color="#3B82F6" />
                    Taxa de Conversão — Março
                </CardTitle>
                <CardSubtitle>vs Fev: +12%</CardSubtitle>
            </CardHeader>

            <ChartContainer>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <CenterContent>
                    <CenterPercentage>{percentage}%</CenterPercentage>
                    <CenterLabel>convertidos</CenterLabel>
                </CenterContent>
            </ChartContainer>

            <StatsContainer>
                {data.map((item, index) => (
                    <StatItem key={index}>
                        <StatValue $color={item.color}>{item.value}</StatValue>
                        <StatLabel>{item.name}</StatLabel>
                    </StatItem>
                ))}
            </StatsContainer>
        </CardBase>
    );
}
