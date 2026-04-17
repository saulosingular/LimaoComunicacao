import { supabaseBrowser, withEmpresaId } from '@/shared/lib/supabase/client';
import type {
  IDbOrcamento, IDbOrcamentoCompleto,
  IInsertOrcamento, IUpdateOrcamento,
  IInsertOrcamentoItem, IUpdateOrcamentoItem,
  IInsertOrcamentoSubitem,
  IInsertFollowup,
  IInsertOrcamentoHistoricoStatus,
} from '@/shared/interfaces/supabase';

/**
 * Serviço de Orçamentos / Ordens de Serviço.
 * Cobre CRUD, itens, subitens, follow-ups, auditoria e duplicação.
 */
export const orcamentoService = {

  // ─── Listagem ──────────────────────────────────────────────────────────────
  async listar(filtros?: { arquivado?: boolean; statusCodigo?: string; clienteId?: string }) {
    let query = supabaseBrowser
      .from('orcamentos')
      .select(`
        id, numero_os, versao_os, status_codigo, arquivado,
        data_criacao, data_validade, data_entrega, valor_total, followup_realizado,
        cliente:clientes ( id, nome, whatsapp )
      `)
      .order('data_criacao', { ascending: false });

    if (filtros?.arquivado !== undefined) query = query.eq('arquivado', filtros.arquivado);
    if (filtros?.statusCodigo) query = query.eq('status_codigo', filtros.statusCodigo);
    if (filtros?.clienteId) query = query.eq('cliente_id', filtros.clienteId);

    return query;
  },

  /** OS completa com cliente, itens, subitens e follow-ups (tela de edição) */
  async buscarCompleto(id: string) {
    return supabaseBrowser
      .from('orcamentos')
      .select(`
        *,
        cliente:clientes ( * ),
        itens:orcamento_itens ( *, subitens:orcamento_subitens ( * ) ),
        followups ( * )
      `)
      .eq('id', id)
      .order('sequencia', { referencedTable: 'orcamento_itens', ascending: true })
      .single<IDbOrcamentoCompleto>();
  },

  // ─── CRUD ──────────────────────────────────────────────────────────────────
  /** numero_os é gerado automaticamente pelo trigger do banco */
  async criar(dados: IInsertOrcamento) {
    const dadosInjetados = await withEmpresaId(dados);
    return supabaseBrowser
      .from('orcamentos')
      .insert({ ...dadosInjetados, numero_os: 0 })
      .select()
      .single<IDbOrcamento>();
  },

  async atualizar(id: string, dados: IUpdateOrcamento) {
    return supabaseBrowser
      .from('orcamentos')
      .update(dados)
      .eq('id', id)
      .select()
      .single<IDbOrcamento>();
  },

  async arquivar(id: string)    { return supabaseBrowser.from('orcamentos').update({ arquivado: true }).eq('id', id); },
  async desarquivar(id: string) { return supabaseBrowser.from('orcamentos').update({ arquivado: false }).eq('id', id); },
  async deletar(id: string)     { return supabaseBrowser.from('orcamentos').delete().eq('id', id); },

  /** Cria nova versão (A→B→C) de uma OS existente */
  async duplicar(id: string) {
    const { data: original, error } = await supabaseBrowser
      .from('orcamentos').select('*').eq('id', id).single<IDbOrcamento>();
    if (error || !original) return { data: null, error: error ?? new Error('OS não encontrada') };

    const { data: irmas } = await supabaseBrowser
      .from('orcamentos').select('versao_os').eq('numero_os', original.numero_os);
    const ultimaVersao = irmas?.reduce((acc, c) => c.versao_os > acc ? c.versao_os : acc, 'A') ?? 'A';
    const proximaVersao = String.fromCharCode(ultimaVersao.charCodeAt(0) + 1);

    return supabaseBrowser.from('orcamentos').insert({
      cliente_id: original.cliente_id,
      criado_por: original.criado_por,
      numero_os: original.numero_os,
      versao_os: proximaVersao,
      status_codigo: 'RASCUNHO',
      arquivado: false,
      data_criacao: new Date().toISOString().split('T')[0],
      data_validade: original.data_validade,
      data_entrega: original.data_entrega,
      valor_total: original.valor_total,
      condicao_pagamento: original.condicao_pagamento,
      prazo_pagamento: original.prazo_pagamento,
      origem_cliente: original.origem_cliente,
      tipo_followup_id: original.tipo_followup_id,
      followup_realizado: false,
    }).select().single<IDbOrcamento>();
  },

  /** Muda status e registra auditoria automaticamente */
  async mudarStatus(id: string, statusNovo: string, statusAnterior: string, alteradoPorId?: string, observacao?: string) {
    const { error } = await supabaseBrowser.from('orcamentos').update({ status_codigo: statusNovo }).eq('id', id);
    if (error) return { error };

    return supabaseBrowser.from('orcamento_historico_status').insert({
      orcamento_id: id,
      alterado_por: alteradoPorId ?? null,
      status_anterior: statusAnterior,
      status_novo: statusNovo,
      observacao: observacao ?? null,
    } satisfies IInsertOrcamentoHistoricoStatus);
  },

  // ─── Itens ─────────────────────────────────────────────────────────────────
  async adicionarItem(dados: IInsertOrcamentoItem) {
    return supabaseBrowser.from('orcamento_itens').insert(dados).select().single();
  },
  async atualizarItem(id: string, dados: IUpdateOrcamentoItem) {
    return supabaseBrowser.from('orcamento_itens').update(dados).eq('id', id).select().single();
  },
  async deletarItem(id: string) {
    return supabaseBrowser.from('orcamento_itens').delete().eq('id', id);
  },

  /** Substitui todos os itens de uma OS em uma única operação */
  async sincronizarItens(orcamentoId: string, itens: IInsertOrcamentoItem[]) {
    const { error } = await supabaseBrowser.from('orcamento_itens').delete().eq('orcamento_id', orcamentoId);
    if (error) return { error };
    if (itens.length === 0) return { data: [], error: null };
    return supabaseBrowser.from('orcamento_itens').insert(itens).select();
  },

  // ─── Subitens ──────────────────────────────────────────────────────────────
  async adicionarSubitem(dados: IInsertOrcamentoSubitem) {
    return supabaseBrowser.from('orcamento_subitens').insert(dados).select().single();
  },
  async deletarSubitem(id: string) {
    return supabaseBrowser.from('orcamento_subitens').delete().eq('id', id);
  },

  // ─── Follow-ups ────────────────────────────────────────────────────────────
  async listarFollowups(orcamentoId: string) {
    return supabaseBrowser
      .from('followups')
      .select('*, realizado_por:usuarios ( id, nome )')
      .eq('orcamento_id', orcamentoId)
      .order('data_contato', { ascending: false });
  },

  async adicionarFollowup(dados: IInsertFollowup) {
    const result = await supabaseBrowser.from('followups').insert(dados).select().single();
    if (!result.error) {
      await supabaseBrowser.from('orcamentos').update({ followup_realizado: true }).eq('id', dados.orcamento_id);
    }
    return result;
  },

  async deletarFollowup(id: string) {
    return supabaseBrowser.from('followups').delete().eq('id', id);
  },

  // ─── Auditoria ─────────────────────────────────────────────────────────────
  async listarHistoricoStatus(orcamentoId: string) {
    return supabaseBrowser
      .from('orcamento_historico_status')
      .select('*, alterado_por:usuarios ( id, nome )')
      .eq('orcamento_id', orcamentoId)
      .order('alterado_em', { ascending: false });
  },
};
