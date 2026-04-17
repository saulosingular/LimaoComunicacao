import styled from 'styled-components';

export const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

export const CenterContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const CenterPercentage = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${(props) => props.theme.info};
  line-height: 1;
`;

export const CenterLabel = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.gray500};
  margin-top: 0.2rem;
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
`;

export const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  padding: 0.75rem;
  border-radius: 8px;
`;

export const StatValue = styled.span<{ $color: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.$color};
`;

export const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.gray600};
  margin-top: 0.25rem;
`;
