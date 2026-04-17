'use client';

import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';
import { useDashboard } from '@/hooks/useDashboard';
import { HeaderContainer, Title, HeaderActions, ThemeToggleButton } from './styles';

export function Header() {
    const { isDark, toggleTheme } = useTheme();
    const { titlePage } = useDashboard();

    return (
        <HeaderContainer>
            <Title>{titlePage}</Title>

            <HeaderActions>
                <ThemeToggleButton onClick={toggleTheme} aria-label="Toggle Theme">
                    {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </ThemeToggleButton>
            </HeaderActions>
        </HeaderContainer>
    );
}
