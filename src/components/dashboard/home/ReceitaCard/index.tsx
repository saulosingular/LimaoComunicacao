import React from 'react';
import { FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { CardBase, CardHeader, CardTitle, CardSubtitle } from '../styles';
import {
    MainValueContainer,
    MainValue,
    ComparisonText,
    GridContainer,
    GridItem,
    ItemLabel,
    ItemValue
} from './styles';

interface IReceitaCardData {
    mes: string;
    totalReceita: string;
    comparacaoPercentual: number;
    valorMesAnterior: string;
    comparacaoPositiva: boolean;
    faturado: string;
    emPipeline: string;
    ticketMedio: string;
    metaMensal: string;
}

interface IReceitaCardProps {
    data: IReceitaCardData;
}

export function ReceitaCard({ data }: IReceitaCardProps) {
    return (
        <CardBase>
            <CardHeader>
                <CardTitle>
                    <FiDollarSign color="#10B981" />
                    Receita do Mês
                </CardTitle>
                <CardSubtitle>{data.mes}</CardSubtitle>
            </CardHeader>

            <MainValueContainer>
                <MainValue>{data.totalReceita}</MainValue>
                <ComparisonText $positive={data.comparacaoPositiva}>
                    <FiTrendingUp /> {data.comparacaoPercentual}% comparado ao mês anterior ({data.valorMesAnterior})
                </ComparisonText>
            </MainValueContainer>

            <GridContainer>
                <GridItem>
                    <ItemLabel>FATURADO</ItemLabel>
                    <ItemValue $color="success">{data.faturado}</ItemValue>
                </GridItem>
                <GridItem>
                    <ItemLabel>EM PIPELINE</ItemLabel>
                    <ItemValue $color="info">{data.emPipeline}</ItemValue>
                </GridItem>
                <GridItem>
                    <ItemLabel>TICKET MÉDIO</ItemLabel>
                    <ItemValue $color="secondary">{data.ticketMedio}</ItemValue>
                </GridItem>
                <GridItem>
                    <ItemLabel>META MENSAL</ItemLabel>
                    <ItemValue $color="warning">{data.metaMensal}</ItemValue>
                </GridItem>
            </GridContainer>
        </CardBase>
    );
}
