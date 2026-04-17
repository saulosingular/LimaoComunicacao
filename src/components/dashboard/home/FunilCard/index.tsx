import React from 'react';
import { FiTarget } from 'react-icons/fi';
import { CardBase, CardHeader, CardTitle, CardSubtitle } from '../styles';
import {
  FunnelContainer,
  FunnelRow,
  LabelColumn,
  BarColumn,
  BarContainer,
  BarFill,
  BarLabel,
  ValueColumn
} from './styles';

interface IFunilItem {
  label: string;
  value: number;
  color: string;
  width: number;
  suffix: string;
}

interface IFunilCardProps {
  data: IFunilItem[];
}

export function FunilCard({ data }: IFunilCardProps) {
  return (
    <CardBase>
      <CardHeader>
        <CardTitle>
          <FiTarget color="#EF4444" />
          Funil de Conversão
        </CardTitle>
        <CardSubtitle>Este mês</CardSubtitle>
      </CardHeader>

      <FunnelContainer>
        {data.map((item, index) => (
          <FunnelRow key={index}>
            <LabelColumn>{item.label}</LabelColumn>
            <BarColumn>
              <BarContainer>
                <BarFill style={{ width: `${item.width}%`, backgroundColor: item.color }}>
                  <BarLabel>{item.value}{item.suffix}</BarLabel>
                </BarFill>
              </BarContainer>
            </BarColumn>
            <ValueColumn $color={item.color}>{item.value}</ValueColumn>
          </FunnelRow>
        ))}
      </FunnelContainer>
    </CardBase >
  );
}
