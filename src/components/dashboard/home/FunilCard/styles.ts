import styled from 'styled-components';

export const FunnelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex-grow: 1;
  justify-content: center;
`;

export const FunnelRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

export const LabelColumn = styled.div`
  width: 90px;
  font-size: 0.8rem;
  color: ${(props) => props.theme.gray600};
  text-align: left;
`;

export const BarColumn = styled.div`
  flex-grow: 1;
  position: relative;
`;

export const BarContainer = styled.div`
  width: 100%;
  height: 38px;
  background-color: ${(props) => props.theme.background};
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

export const BarFill = styled.div`
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  transition: width 0.8s ease-in-out;
`;

export const BarLabel = styled.span`
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
`;

export const ValueColumn = styled.div<{ $color: string }>`
  width: 30px;
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) => props.$color};
  text-align: right;
`;
