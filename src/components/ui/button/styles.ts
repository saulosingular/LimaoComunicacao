'use client';

import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';
import { ICustomTheme, handleColorType } from '@/shared/styles/globals';
import { useTheme } from '@/hooks/useTheme';

interface IButtonProps {
  $customColor?: ICustomTheme;
  $widthFull?: boolean;
  $variant?: 'solid' | 'outline' | 'ghost';
  $isDark?: boolean;
}

export const ButtonMain = styled.button<IButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  outline: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-align: center;

  cursor: pointer;
  transition: all 0.2s;
  
  /* Defaults */
  background-color: transparent;
  color: ${(props) => props.theme.gray900};
  border: 1px solid transparent;

  ${(props) =>
    props.$widthFull &&
    css`
      width: 100%;
    `}

  /* Variant Solid */
  ${(props) =>
    props.$variant === 'solid' &&
    props.$customColor &&
    css`
      background-color: ${handleColorType(props.$customColor, props.$isDark)};
      color: #fff;
      border: 1px solid ${handleColorType(props.$customColor, props.$isDark)};

      &:hover:not(:disabled) {
        background-color: ${darken(0.1, handleColorType(props.$customColor, props.$isDark))};
        border-color: ${darken(0.1, handleColorType(props.$customColor, props.$isDark))};
      }
    `}

  /* Variant Outline */
  ${(props) =>
    props.$variant === 'outline' &&
    props.$customColor &&
    css`
      background-color: transparent;
      color: ${handleColorType(props.$customColor, props.$isDark)};
      border: 1px solid ${handleColorType(props.$customColor, props.$isDark)};

      &:hover:not(:disabled) {
        background-color: ${handleColorType(props.$customColor, props.$isDark)};
        color: #fff;
      }
    `}

  /* Variant Ghost */
  ${(props) =>
    props.$variant === 'ghost' &&
    props.$customColor &&
    css`
      background-color: transparent;
      color: ${handleColorType(props.$customColor, props.$isDark)};
      
      &:hover:not(:disabled) {
        background-color: ${lighten(0.4, handleColorType(props.$customColor, props.$isDark))};
      }
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
