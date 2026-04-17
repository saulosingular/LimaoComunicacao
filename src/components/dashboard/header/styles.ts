'use client';

import styled from 'styled-components';

export const HeaderContainer = styled.header`
  height: 70px;
  background-color: ${(props) => props.theme.container};
  border-bottom: 1px solid ${(props) => props.theme.gray200};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.gray900};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.gray600};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.gray150};
    color: ${(props) => props.theme.primary500};
  }
`;
