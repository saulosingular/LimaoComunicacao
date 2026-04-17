import { create } from 'zustand';
import { supabaseBrowser } from '@/shared/lib/supabase/client';
import { IOrcamentoDTO } from '@/shared/interfaces/orcamento';
import {
  orcamentoService,
  statusOrcamentoService,
  tipoFollowupService,
  clienteService,
} from '@/shared/services';
import {
  dbListagemToOrcamentoDTO,
  dbToOrcamentoDTO,
  dtoToInsertOrcamento,
  dtoToInsertItem,
  dtoToInsertSubitem,
  dbToStatusOption,
  dbToTipoFollowup,
} from '@/shared/utils/adapters';
import type { IDbOrcamentoListagemRow } from '@/shared/utils/adapters';

export interface IOrcamentoStatusOption {
  id: string;
  label: string;
  color: string;
  order: number;
}

export interface ITipoFollowup {
  id: string;
  nome: string;
  descricao?: string;
}

interface IOrcamentoState {
  orcamentos: IOrcamentoDTO[];
  statusOptions: IOrcamentoStatusOption[];
  tiposFollowup: ITipoFollowup[];
  loading: boolean;
  error: string | null;

  fetchOrcamentos: (filtros?: { arquivado?: boolean }) => Promise<void>;
  fetchOrcamentoCompleto: (id: string) => Promise<IOrcamentoDTO | null>;
  fetchStatusOptions: () => Promise<void>;
  fetchTiposFollowup: () => Promise<void>;

  addOrcamento: (item: Omit<IOrcamentoDTO, 'id' | 'numeroOs' | 'versaoOs'>) => Promise<string | null>;
  updateOrcamento: (id: string, data: Partial<IOrcamentoDTO>) => Promise<void>;
  deleteOrcamento: (id: string) => Promise<void>;
  archiveOrcamento: (id: string) => Promise<void>;
  duplicateOrcamento: (id: string) => Promise<void>;
  mudarStatus: (id: string, statusNovo: string, statusAnterior: string) => Promise<void>;

  addTipoFollowup: (data: Omit<ITipoFollowup, 'id'>) => Promise<void>;
  deleteTipoFollowup: (id: string) => Promise<void>;
}

export const useOrcamento = create<IOrcamentoState>()((set, get) => ({
  orcamentos: [],
  statusOptions: [],
  tiposFollowup: [],
  loading: false,
  error: null,

  fetchOrcamentos: async (filtros) => {
    set({ loading: true, error: null });
    const { data, error } = await orcamentoService.listar(filtros);
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const items = (data as IDbOrcamentoListagemRow[] || []).map(dbListagemToOrcamentoDTO);
    set({ orcamentos: items, loading: false });
  },

  fetchOrcamentoCompleto: async (id: string) => {
    const { data, error } = await orcamentoService.buscarCompleto(id);
    if (error || !data) return null;
    return dbToOrcamentoDTO(data as any);
  },

  fetchStatusOptions: async () => {
    const { data, error } = await statusOrcamentoService.listar();
    if (error) return;
    set({ statusOptions: (data || []).map(dbToStatusOption) });
  },

  fetchTiposFollowup: async () => {
    const { data, error } = await tipoFollowupService.listar();
    if (error) return;
    set({ tiposFollowup: (data || []).map(dbToTipoFollowup) });
  },

  addOrcamento: async (item) => {
    set({ loading: true, error: null });
    try {
      // Auto-criar cliente pelo nome se não houver clienteId
      let clienteId = item.clienteId || null;
      if (!clienteId && item.cliente) {
        const { data: clienteData, error: cliError } = await clienteService.criar({
          nome: item.cliente,
          whatsapp: item.whatsapp || null,
        } as any);
        if (cliError) throw new Error(`Erro ao criar cliente: ${cliError.message}`);
        if (clienteData) clienteId = clienteData.id;
      }

      const insertData = dtoToInsertOrcamento({ ...item, clienteId: clienteId || undefined });
      const { data: orcData, error: orcError } = await orcamentoService.criar(insertData);
      if (orcError || !orcData) throw new Error(orcError?.message || 'Erro ao criar orçamento');

      const orcamentoId = orcData.id;

      // Sincroniza itens
      if (item.itens?.length) {
        for (let i = 0; i < item.itens.length; i++) {
          const itemDTO = item.itens[i];
          const insertItem = dtoToInsertItem(orcamentoId, itemDTO);
          
          const { data: newItem, error: errItem } = await orcamentoService.adicionarItem(insertItem);
          if (errItem || !newItem) throw new Error(errItem?.message || 'Erro ao inserir item');

          if (itemDTO.subItens && itemDTO.subItens.length > 0) {
            const subsInsert = itemDTO.subItens.map(s => dtoToInsertSubitem(newItem.id, s));
            const { error: errSub } = await supabaseBrowser.from('orcamento_subitens').insert(subsInsert);
            if (errSub) throw new Error(`Erro ao inserir subitens: ${errSub.message}`);
          }
        }
      }

      await get().fetchOrcamentos();
      return orcamentoId;
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  updateOrcamento: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // Auto-criar cliente pelo nome se necessário, ou atualizar existente
      let clienteId = data.clienteId;
      if (!clienteId && data.cliente) {
        const { data: clienteData, error: cliError } = await clienteService.criar({
          nome: data.cliente,
          whatsapp: data.whatsapp || null,
        } as any);
        if (cliError) throw new Error(`Erro ao criar cliente vinculável: ${cliError.message}`);
        if (clienteData) clienteId = clienteData.id;
      } else if (clienteId && (data.cliente !== undefined || data.whatsapp !== undefined)) {
        // Se já tem cliente, vamos atualizar o nome/whatsapp dele
        const payloadCli: any = {};
        if (data.cliente !== undefined) payloadCli.nome = data.cliente;
        if (data.whatsapp !== undefined) payloadCli.whatsapp = data.whatsapp || null;
        
        if (Object.keys(payloadCli).length > 0) {
           const { error: cliUpdateError } = await clienteService.atualizar(clienteId, payloadCli);
           if (cliUpdateError) console.error('Erro ao atualizar cliente', cliUpdateError);
        }
      }

      // Atualiza campos do orçamento
      const updatePayload: Record<string, unknown> = {};
      if (clienteId !== undefined) updatePayload.cliente_id = clienteId || null;
      if (data.dataCriacao !== undefined) updatePayload.data_criacao = data.dataCriacao;
      if (data.dataValidade !== undefined) updatePayload.data_validade = data.dataValidade;
      if (data.dataEntrega !== undefined) updatePayload.data_entrega = data.dataEntrega || null;
      if (data.valorTotalOrcamento !== undefined) updatePayload.valor_total = data.valorTotalOrcamento;
      if (data.condicaoPagamento !== undefined) updatePayload.condicao_pagamento = data.condicaoPagamento || null;
      if (data.prazoPagamento !== undefined) updatePayload.prazo_pagamento = data.prazoPagamento || null;
      if (data.origemCliente !== undefined) updatePayload.origem_cliente = data.origemCliente || null;
      if (data.tipoFollowupId !== undefined) updatePayload.tipo_followup_id = data.tipoFollowupId || null;
      if (data.followupRealizado !== undefined) updatePayload.followup_realizado = data.followupRealizado;
      if (data.status !== undefined) updatePayload.status_codigo = data.status;
      if (data.arquivado !== undefined) updatePayload.arquivado = data.arquivado;

      if (Object.keys(updatePayload).length > 0) {
        const { error } = await orcamentoService.atualizar(id, updatePayload);
        if (error) throw new Error(error.message);
      }

      // Sincroniza itens se fornecidos
      if (data.itens) {
        // Limpa itens antigos para este orçamento (cascade apaga os subitens)
        const { error: delError } = await supabaseBrowser.from('orcamento_itens').delete().eq('orcamento_id', id);
        if (delError) throw new Error(delError.message);

        for (let i = 0; i < data.itens.length; i++) {
          const itemDTO = data.itens[i];
          const insertItem = dtoToInsertItem(id, itemDTO);
          
          const { data: newItem, error: errItem } = await orcamentoService.adicionarItem(insertItem);
          if (errItem || !newItem) throw new Error(errItem?.message || 'Erro ao re-inserir item');

          if (itemDTO.subItens && itemDTO.subItens.length > 0) {
            const subsInsert = itemDTO.subItens.map(s => dtoToInsertSubitem(newItem.id, s));
            const { error: errSub } = await supabaseBrowser.from('orcamento_subitens').insert(subsInsert);
            if (errSub) throw new Error(`Erro ao re-inserir subitens: ${errSub.message}`);
          }
        }
      }

      await get().fetchOrcamentos();
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  deleteOrcamento: async (id) => {
    set({ loading: true, error: null });
    const { error } = await orcamentoService.deletar(id);
    if (error) {
      set({ loading: false, error: error.message });
      throw new Error(error.message);
    }
    await get().fetchOrcamentos();
  },

  archiveOrcamento: async (id) => {
    const orc = get().orcamentos.find(o => o.id === id);
    if (!orc) return;
    const isArchived = !!orc.arquivado;
    const { error } = isArchived
      ? await orcamentoService.desarquivar(id)
      : await orcamentoService.arquivar(id);
    if (error) throw new Error(error.message);
    await get().fetchOrcamentos();
  },

  duplicateOrcamento: async (id) => {
    set({ loading: true, error: null });
    const { error } = await orcamentoService.duplicar(id);
    if (error) {
      set({ loading: false, error: error instanceof Error ? error.message : (error as any).message });
      throw error;
    }
    await get().fetchOrcamentos();
  },

  mudarStatus: async (id, statusNovo, statusAnterior) => {
    const { error } = await orcamentoService.mudarStatus(id, statusNovo, statusAnterior);
    if (error) throw new Error(error.message);
    // Atualiza localmente para resposta imediata
    set((state) => ({
      orcamentos: state.orcamentos.map(o =>
        o.id === id ? { ...o, status: statusNovo } : o
      ),
    }));
  },

  addTipoFollowup: async (data) => {
    const { error } = await tipoFollowupService.criar({ nome: data.nome, descricao: data.descricao || null } as any);
    if (error) throw new Error(error.message);
    await get().fetchTiposFollowup();
  },

  deleteTipoFollowup: async (id) => {
    const { error } = await tipoFollowupService.deletar(id);
    if (error) throw new Error(error.message);
    await get().fetchTiposFollowup();
  },
}));
