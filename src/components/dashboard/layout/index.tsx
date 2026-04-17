'use client';

import React from 'react';
import { Sidebar } from '../sideBar';
import { Header } from '../header';
import { LayoutContainer, MainContent, ContentArea } from './styles';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutContainer>
            <Sidebar />
            <MainContent>
                <Header />
                <ContentArea>
                    {children}
                </ContentArea>
            </MainContent>
        </LayoutContainer>
    );
}
