import { supabaseBrowser } from '@/shared/lib/supabase';
import type {
  IDbStatusOrcamento, IInsertStatusOrcamento, IUpdateStatusOrcamento,
  IDbTipoFollowup, IInsertTipoFollowup, IUpdateTipoFollowup,
} from '@/shared/interfaces/supabase';

// ─── Status de Orçamento (Kanban) ─────────────────────────────────────────────
export const statusOrcamentoService = {

  async listar() {
    return supabaseBrowser.from('status_orcamento').select('*').order('ordem', { ascending: true });
  },

  async criar(dados: IInsertStatusOrcamento) {
    return supabaseBrowser.from('status_orcamento').insert(dados).select().single<IDbStatusOrcamento>();
  },

  async atualizar(id: string, dados: IUpdateStatusOrcamento) {
    return supabaseBrowser.from('status_orcamento').update(dados).eq('id', id).select().single<IDbStatusOrcamento>();
  },

  async deletar(id: string) {
    return supabaseBrowser.from('status_orcamento').delete().eq('id', id);
  },

  async reordenar(statusOrdenados: Array<{ id: string; ordem: number }>) {
    return Promise.all(
      statusOrdenados.map(({ id, ordem }) =>
        supabaseBrowser.from('status_orcamento').update({ ordem }).eq('id', id)
      )
    );
  },
};

// ─── Tipos de Follow-up (Cadências) ──────────────────────────────────────────
export const tipoFollowupService = {

  async listar() {
    return supabaseBrowser.from('tipos_followup').select('*').order('nome', { ascending: true });
  },

  async criar(dados: IInsertTipoFollowup) {
    return supabaseBrowser.from('tipos_followup').insert(dados).select().single<IDbTipoFollowup>();
  },

  async atualizar(id: string, dados: IUpdateTipoFollowup) {
    return supabaseBrowser.from('tipos_followup').update(dados).eq('id', id).select().single<IDbTipoFollowup>();
  },

  async deletar(id: string) {
    return supabaseBrowser.from('tipos_followup').delete().eq('id', id);
  },
};
