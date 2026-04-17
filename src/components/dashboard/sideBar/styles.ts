'use client';

import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  width: ${(props) => (props.$isOpen ? '260px' : '80px')};
  background-color: ${(props) => props.theme.primary900};
  color: ${(props) => props.theme.gray100};
  height: 100vh;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
`;

export const SidebarHeader = styled.div<{ $isOpen: boolean }>`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$isOpen ? 'space-between' : 'center')};
  padding: ${(props) => (props.$isOpen ? '0 1.5rem' : '0')};
  background-color: ${(props) => props.theme.primary900};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${(props) => props.theme.primary200};
    white-space: nowrap;
    overflow: hidden;
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  }
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.gray100};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const NavList = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  gap: 0.5rem;
`;

export const LogoutButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem ${(props) => (props.$isOpen ? '1.5rem' : '0')};
  justify-content: ${(props) => (props.$isOpen ? 'flex-start' : 'center')};
  width: 100%;
  background: none;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(props) => props.theme.gray300};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${(props) => props.theme.primary100};
  }

  svg {
    min-width: 24px;
    height: 24px;
  }

  span {
    margin-left: 1rem;
    font-size: 0.95rem;
    white-space: nowrap;
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  }
`;

export const NavItem = styled(NavLink)<{ $active?: boolean; $isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem ${(props) => (props.$isOpen ? '1.5rem' : '0')};
  justify-content: ${(props) => (props.$isOpen ? 'flex-start' : 'center')};
  color: ${(props) => (props.$active ? props.theme.primary100 : props.theme.gray300)};
  text-decoration: none;
  transition: all 0.2s;
  position: relative;

  ${(props) =>
    props.$active &&
    css`
      background-color: rgba(255, 255, 255, 0.1);
      border-right: 4px solid ${props.theme.primary400};
    `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${(props) => props.theme.primary100};
  }

  svg {
    min-width: 24px;
    height: 24px;
  }

  span {
    margin-left: 1rem;
    font-size: 0.95rem;
    white-space: nowrap;
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  }
`;
