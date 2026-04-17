import { supabaseBrowser, withEmpresaId } from '@/shared/lib/supabase/client';
import type { IDbCliente, IInsertCliente, IUpdateCliente } from '@/shared/interfaces/supabase';

/**
 * Serviço de Clientes — CRUD contra a tabela `clientes`.
 * RLS garante isolamento por empresa automaticamente.
 */
export const clienteService = {

  async listar(filtros?: { nome?: string; ativo?: boolean }) {
    let query = supabaseBrowser
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true });

    if (filtros?.nome) query = query.ilike('nome', `%${filtros.nome}%`);

    const ativo = filtros?.ativo !== undefined ? filtros.ativo : true;
    query = query.eq('ativo', ativo);

    return query;
  },

  async buscarPorId(id: string) {
    return supabaseBrowser
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single<IDbCliente>();
  },

  async criar(dados: IInsertCliente) {
    const dadosInjetados = await withEmpresaId(dados);
    return supabaseBrowser
      .from('clientes')
      .insert(dadosInjetados)
      .select()
      .single<IDbCliente>();
  },

  async atualizar(id: string, dados: IUpdateCliente) {
    return supabaseBrowser
      .from('clientes')
      .update(dados)
      .eq('id', id)
      .select()
      .single<IDbCliente>();
  },

  async desativar(id: string) {
    return supabaseBrowser
      .from('clientes')
      .update({ ativo: false })
      .eq('id', id);
  },

  /** Listagem enxuta para dropdowns de seleção nos formulários */
  async listarParaSelecao() {
    return supabaseBrowser
      .from('clientes')
      .select('id, nome, whatsapp, email')
      .eq('ativo', true)
      .order('nome', { ascending: true });
  },
};
