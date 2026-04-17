import { supabaseBrowser } from '@/shared/lib/supabase';
import type { IDbConfiguracaoEmpresa, IInsertConfiguracaoEmpresa, IUpdateConfiguracaoEmpresa } from '@/shared/interfaces/supabase';

/** Configurações chave-valor da empresa — metas mensais, prazos-padrão, etc. */
export const configuracaoEmpresaService = {

  async listar() {
    return supabaseBrowser.from('configuracoes_empresa').select('*').order('chave', { ascending: true });
  },

  async buscarPorChave(chave: string, mesRef?: string) {
    let query = supabaseBrowser.from('configuracoes_empresa').select('*').eq('chave', chave);
    query = mesRef ? query.eq('mes_ref', mesRef) : query.is('mes_ref', null);
    return query.maybeSingle<IDbConfiguracaoEmpresa>();
  },

  /** Upsert — cria se não existe, atualiza se existe (ideal para metas) */
  async salvar(dados: IInsertConfiguracaoEmpresa) {
    return supabaseBrowser
      .from('configuracoes_empresa')
      .upsert(dados, { onConflict: 'empresa_id,chave,mes_ref', ignoreDuplicates: false })
      .select()
      .single<IDbConfiguracaoEmpresa>();
  },

  async atualizar(id: string, dados: IUpdateConfiguracaoEmpresa) {
    return supabaseBrowser.from('configuracoes_empresa').update(dados).eq('id', id).select().single<IDbConfiguracaoEmpresa>();
  },

  async deletar(id: string) {
    return supabaseBrowser.from('configuracoes_empresa').delete().eq('id', id);
  },

  // ─── Helpers de domínio ───────────────────────────────────────────────────

  /** Retorna a meta mensal como número. @param mesRef Formato 'YYYY-MM' */
  async getMetaMensal(mesRef: string): Promise<number | null> {
    const { data } = await configuracaoEmpresaService.buscarPorChave('META_MENSAL', mesRef);
    return data ? Number(data.valor) : null;
  },

  /** Salva a meta mensal. @param mesRef Formato 'YYYY-MM' */
  async setMetaMensal(mesRef: string, valor: number) {
    return configuracaoEmpresaService.salvar({ chave: 'META_MENSAL', valor: String(valor), mes_ref: mesRef });
  },
};
