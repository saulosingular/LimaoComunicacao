import { supabaseBrowser } from '@/shared/lib/supabase';
import type { IDbUsuario, IInsertUsuario, IUpdateUsuario } from '@/shared/interfaces/supabase';

/** Autenticação via Supabase Auth nativo e gerenciamento de perfil/usuários */
export const authService = {

  async signIn(email: string, senha: string) {
    return supabaseBrowser.auth.signInWithPassword({ email, password: senha });
  },

  async signOut() {
    return supabaseBrowser.auth.signOut();
  },

  async getSession() {
    return supabaseBrowser.auth.getSession();
  },

  async getUser() {
    return supabaseBrowser.auth.getUser();
  },

  async resetPassword(email: string) {
    return supabaseBrowser.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_SITE_URL ?? ''}/nova-senha`,
    });
  },

  async updatePassword(novaSenha: string) {
    return supabaseBrowser.auth.updateUser({ password: novaSenha });
  },

  /** Perfil do usuário logado (join com empresa) */
  async getPerfilAtual() {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) return { data: null, error: new Error('Não autenticado') };
    return supabaseBrowser
      .from('usuarios')
      .select('*, empresa:empresas ( id, nome, logo_url )')
      .eq('id', user.id)
      .single<IDbUsuario>();
  },

  async atualizarPerfilAtual(dados: IUpdateUsuario) {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) return { data: null, error: new Error('Não autenticado') };
    return supabaseBrowser.from('usuarios').update(dados).eq('id', user.id).select().single<IDbUsuario>();
  },
};

/**
 * Gerenciamento de usuários da empresa (apenas para ADMINs).
 * NOTA: criação no auth.users deve ser feita server-side com SERVICE_ROLE_KEY.
 */
export const usuarioService = {

  async listar() {
    return supabaseBrowser.from('usuarios').select('*').order('nome', { ascending: true });
  },

  async buscarPorId(id: string) {
    return supabaseBrowser.from('usuarios').select('*').eq('id', id).single<IDbUsuario>();
  },

  /** Insere o perfil após criação server-side do auth.user */
  async inserirPerfil(dados: IInsertUsuario) {
    return supabaseBrowser.from('usuarios').insert(dados).select().single<IDbUsuario>();
  },

  async atualizar(id: string, dados: IUpdateUsuario) {
    return supabaseBrowser.from('usuarios').update(dados).eq('id', id).select().single<IDbUsuario>();
  },

  async desativar(id: string) {
    return supabaseBrowser.from('usuarios').update({ ativo: false }).eq('id', id);
  },
};
