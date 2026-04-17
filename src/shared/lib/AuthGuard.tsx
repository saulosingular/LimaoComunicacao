import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabaseBrowser } from '@/shared/lib/supabase';
import type { Session } from '@supabase/supabase-js';

/**
 * Protege rotas privadas verificando a sessão do Supabase no lado cliente.
 * - Sem sessão → redireciona para /login
 * - Com sessão → renderiza o conteúdo da rota (Outlet)
 *
 * O Supabase persiste a sessão no localStorage e a renova automaticamente
 * via onAuthStateChange, substituindo o comportamento do middleware Next.js.
 */
export function AuthGuard() {
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const location = useLocation();

    useEffect(() => {
        // Lê a sessão atual
        supabaseBrowser.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        // Escuta mudanças de autenticação (login/logout/refresh)
        const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Enquanto verifica a sessão, mostra um loader neutro
    if (session === undefined) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Carregando...</span>
            </div>
        );
    }

    if (!session) {
        // Redireciona para /login preservando a rota de destino
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
