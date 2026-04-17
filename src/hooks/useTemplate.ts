import { create } from 'zustand';
import { ITemplateDTO } from '@/shared/interfaces/template';
import { templateService } from '@/shared/services';
import { dbToTemplateDTO, dtoToInsertTemplate, dtoToInsertSecao, dtoToInsertCampo, dtoToInsertOpcao } from '@/shared/utils/adapters';

interface ITemplateState {
  templates: ITemplateDTO[];
  loading: boolean;
  error: string | null;

  fetchTemplates: () => Promise<void>;
  fetchTemplateCompleto: (id: string) => Promise<ITemplateDTO | null>;
  addTemplate: (item: Omit<ITemplateDTO, 'id'>) => Promise<void>;
  updateTemplate: (id: string, data: Partial<ITemplateDTO>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

export const useTemplate = create<ITemplateState>()((set, get) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    const { data, error } = await templateService.listarCompletos();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const items = (data || []).map((t: any) => dbToTemplateDTO(t));
    set({ templates: items, loading: false });
  },

  fetchTemplateCompleto: async (id: string) => {
    const { data, error } = await templateService.buscarCompleto(id);
    if (error || !data) return null;
    return dbToTemplateDTO(data as any);
  },

  addTemplate: async (item) => {
    set({ loading: true, error: null });
    try {
      // 1. Cria o template base
      const insertData = dtoToInsertTemplate(item);
      const { data: tplData, error: tplError } = await templateService.criar(insertData);
      if (tplError || !tplData) throw new Error(tplError?.message || 'Erro ao criar template');

      const templateId = tplData.id;

      // 2. Cria seções, campos e opções em sequência
      for (let sIdx = 0; sIdx < item.secoes.length; sIdx++) {
        const secaoDTO = item.secoes[sIdx];
        const secaoInsert = dtoToInsertSecao(templateId, secaoDTO, sIdx);
        const { data: secaoData, error: secaoError } = await templateService.criarSecao(secaoInsert);
        if (secaoError || !secaoData) throw new Error(secaoError?.message || 'Erro ao criar seção');

        const secaoId = secaoData.id;

        for (let cIdx = 0; cIdx < secaoDTO.campos.length; cIdx++) {
          const campoDTO = secaoDTO.campos[cIdx];
          const campoInsert = dtoToInsertCampo(secaoId, campoDTO, cIdx);
          const { data: campoData, error: campoError } = await templateService.criarCampo(campoInsert);
          if (campoError || !campoData) throw new Error(campoError?.message || 'Erro ao criar campo');

          const campoId = campoData.id;

          if (campoDTO.opcoesLista?.length) {
            for (let oIdx = 0; oIdx < campoDTO.opcoesLista.length; oIdx++) {
              const opcaoInsert = dtoToInsertOpcao(campoId, campoDTO.opcoesLista[oIdx], oIdx);
              const { error: opcaoError } = await templateService.criarOpcao(opcaoInsert);
              if (opcaoError) throw new Error(opcaoError.message);
            }
          }
        }
      }

      // 3. Add-ons
      if (item.addons?.length) {
        for (const addonId of item.addons) {
          await templateService.adicionarAddon(templateId, addonId);
        }
      }

      // 4. Recarrega a lista
      await get().fetchTemplates();
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  updateTemplate: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // Atualiza campos base do template
      if (data.nome !== undefined || data.formulaCalculo !== undefined || data.valorBaseVenda !== undefined) {
        const updatePayload: Record<string, unknown> = {};
        if (data.nome !== undefined) updatePayload.nome = data.nome;
        if (data.formulaCalculo !== undefined) updatePayload.formula_calculo = data.formulaCalculo;
        if (data.valorBaseVenda !== undefined) updatePayload.valor_base_venda = data.valorBaseVenda;
        const { error } = await templateService.atualizar(id, updatePayload);
        if (error) throw new Error(error.message);
      }

      // Se secoes foram enviadas, recria toda a estrutura (delete + create)
      if (data.secoes) {
        // Busca template completo para deletar seções existentes
        const { data: existente } = await templateService.buscarCompleto(id);
        if (existente) {
          const raw = existente as any;
          const secoesExistentes = raw.secoes || [];
          for (const secao of secoesExistentes) {
            await templateService.deletarSecao(secao.id);
          }
        }

        // Recria seções, campos e opções
        for (let sIdx = 0; sIdx < data.secoes.length; sIdx++) {
          const secaoDTO = data.secoes[sIdx];
          const secaoInsert = dtoToInsertSecao(id, secaoDTO, sIdx);
          const { data: secaoData, error: secaoError } = await templateService.criarSecao(secaoInsert);
          if (secaoError || !secaoData) throw new Error(secaoError?.message || 'Erro ao criar seção');

          const secaoId = secaoData.id;

          for (let cIdx = 0; cIdx < secaoDTO.campos.length; cIdx++) {
            const campoDTO = secaoDTO.campos[cIdx];
            const campoInsert = dtoToInsertCampo(secaoId, campoDTO, cIdx);
            const { data: campoData, error: campoError } = await templateService.criarCampo(campoInsert);
            if (campoError || !campoData) throw new Error(campoError?.message || 'Erro ao criar campo');

            const campoId = campoData.id;

            if (campoDTO.opcoesLista?.length) {
              for (let oIdx = 0; oIdx < campoDTO.opcoesLista.length; oIdx++) {
                const opcaoInsert = dtoToInsertOpcao(campoId, campoDTO.opcoesLista[oIdx], oIdx);
                const { error: opcaoError } = await templateService.criarOpcao(opcaoInsert);
                if (opcaoError) throw new Error(opcaoError.message);
              }
            }
          }
        }
      }

      // Atualiza add-ons se fornecidos
      if (data.addons !== undefined) {
        const { data: existente } = await templateService.buscarCompleto(id);
        const currentAddons: string[] = existente
          ? (existente as any).template_addons?.map((a: any) => a.addon_id) || (existente as any).addons || []
          : [];
        
        // Remove add-ons que não estão mais na lista
        for (const addonId of currentAddons) {
          if (!data.addons.includes(addonId)) {
            await templateService.removerAddon(id, addonId);
          }
        }
        // Adiciona novos
        for (const addonId of data.addons) {
          if (!currentAddons.includes(addonId)) {
            await templateService.adicionarAddon(id, addonId);
          }
        }
      }

      await get().fetchTemplates();
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  deleteTemplate: async (id) => {
    set({ loading: true, error: null });
    const { error } = await templateService.desativar(id);
    if (error) {
      set({ loading: false, error: error.message });
      throw new Error(error.message);
    }
    await get().fetchTemplates();
  },
}));
