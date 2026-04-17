import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para uso em COMPONENTES CLIENT-SIDE.
 * Este cliente usa a ANON KEY e é seguro para o navegador.
 * As políticas RLS do Supabase garantem o isolamento por empresa.
 *
 * @example
 * import { supabaseBrowser } from '@/shared/lib/supabase/client';
 *
 * const { data, error } = await supabaseBrowser
 *   .from('orcamentos')
 *   .select('*');
 */
export function createSupabaseBrowserClient() {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );
}

// Instância singleton para uso direto nos hooks
export const supabaseBrowser = createSupabaseBrowserClient();

/**
 * Função utilitária para buscar o empresa_id do usuário logado
 * e injetar no payload de inserção. Útil para tabelas que não
 * possuem trigger de before insert para preencher o id do tenant.
 */
export async function withEmpresaId<T extends Record<string, any>>(dados: T): Promise<T> {
  if ('empresa_id' in dados && dados.empresa_id) {
    return dados;
  }

  try {
    const { data: authData } = await supabaseBrowser.auth.getUser();
    if (authData?.user?.id) {
      const { data: usuarioData } = await supabaseBrowser
        .from('usuarios')
        .select('empresa_id')
        .eq('id', authData.user.id)
        .single();
        
      if (usuarioData?.empresa_id) {
        return { ...dados, empresa_id: usuarioData.empresa_id };
      }
    }
  } catch (err) {
    console.error('Erro ao buscar empresa_id para inserção', err);
  }

  return dados;
}
