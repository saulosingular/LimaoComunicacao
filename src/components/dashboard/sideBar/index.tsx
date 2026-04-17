'use client';

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiLayers, FiDollarSign, FiMenu, FiX, FiTrello, FiLogOut } from 'react-icons/fi';
import { useDashboard } from '@/hooks/useDashboard';
import { authService } from '@/shared/services';
import {
    SidebarContainer,
    SidebarHeader,
    ToggleButton,
    NavList,
    NavItem,
    LogoutButton,
} from './styles';

export function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useDashboard();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    async function handleLogout() {
        await authService.signOut();
        navigate('/login');
    }

    const navItems = [
        { href: '/', icon: FiHome, label: 'Início' },
        { href: '/orcamentos', icon: FiDollarSign, label: 'Orçamentos' },
        { href: '/kanban', icon: FiTrello, label: 'Kanban' },
        { href: '/materiaprima', icon: FiBox, label: 'Matéria Prima' },
        { href: '/templates', icon: FiLayers, label: 'Templates' },
    ];

    return (
        <SidebarContainer $isOpen={sidebarOpen}>
            <SidebarHeader $isOpen={sidebarOpen}>
                <h2>Limão Comunicação</h2>
                <ToggleButton onClick={toggleSidebar} aria-label="Toggle Sidebar">
                    {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </ToggleButton>
            </SidebarHeader>

            <NavList>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <NavItem
                            key={item.href}
                            to={item.href}
                            $active={isActive}
                            $isOpen={sidebarOpen}
                        >
                            <Icon />
                            <span>{item.label}</span>
                        </NavItem>
                    );
                })}
            </NavList>

            <LogoutButton onClick={handleLogout} $isOpen={sidebarOpen}>
                <FiLogOut />
                <span>Sair</span>
            </LogoutButton>
        </SidebarContainer>
    );
}
