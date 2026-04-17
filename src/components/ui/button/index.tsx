'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { ButtonMain } from './styles';
import { ICustomTheme } from '@/shared/styles/globals';
import { useTheme } from '@/hooks/useTheme';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    customColor?: ICustomTheme;
    widthFull?: boolean;
    variant?: 'solid' | 'outline' | 'ghost';
    loading?: boolean;
}

export function Button({
    children,
    customColor = 'primary',
    widthFull = false,
    variant = 'solid',
    loading = false,
    disabled,
    ...props
}: IButtonProps) {
    const { isDark } = useTheme();

    return (
        <ButtonMain
            $customColor={customColor}
            $widthFull={widthFull}
            $variant={variant}
            $isDark={isDark}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? 'Carregando...' : children}
        </ButtonMain>
    );
}
