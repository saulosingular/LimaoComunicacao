import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ThemeWrapper from '@/shared/lib/ThemeWrapper';
import { AuthGuard } from '@/shared/lib/AuthGuard';
import { DashboardLayout } from '@/components/dashboard/layout';

// Pages
import LoginPage from '@/pages/login';
import { DashboardHome } from '@/components/dashboard/home';
import OrcamentosPage from '@/pages/orcamentos';
import OrcamentosCreatePage from '@/pages/orcamentos/create';

import TemplatesPage from '@/pages/templates';
import TemplatesCreatePage from '@/pages/templates/create';
import KanbanPage from '@/pages/kanban';


import MateriaPrimaPage from '@/pages/materiaprima';
import ProducaoPage from '@/pages/producao';
import PropostaPage from '@/pages/proposta';

/** Wrapper que injeta o Outlet (rota filha) dentro do DashboardLayout */
function DashboardWrapper() {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ThemeWrapper>
                <ToastContainer position="top-right" autoClose={3000} theme="colored" />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/producao/:id" element={<ProducaoPage />} />
                    <Route path="/proposta/:id" element={<PropostaPage />} />

                    {/* Protected routes (require auth) */}
                    <Route element={<AuthGuard />}>
                        <Route element={<DashboardWrapper />}>
                            <Route path="/" element={<DashboardHome />} />
                            <Route path="/orcamentos" element={<OrcamentosPage />} />
                            <Route path="/orcamentos/create" element={<OrcamentosCreatePage />} />
                            <Route path="/templates" element={<TemplatesPage />} />
                            <Route path="/templates/create" element={<TemplatesCreatePage />} />
                            <Route path="/kanban" element={<KanbanPage />} />
                            <Route path="/materiaprima" element={<MateriaPrimaPage />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ThemeWrapper>
        </BrowserRouter>
    );
}
