'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, defaultTheme, darkTheme } from '@/shared/styles/globals';
import { useTheme } from '@/hooks/useTheme';


export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { isDark } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Evita hydration mismatch renderizando um fundo em branco/padrão no servidor
        return (
            <ThemeProvider theme={defaultTheme}>
                <GlobalStyle />
                {children}
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={isDark ? darkTheme : defaultTheme}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    );
}
