import { supabaseBrowser } from '@/shared/lib/supabase';
import type {
  IDbTemplate, IInsertTemplate, IUpdateTemplate,
  IDbTemplateCompleto, IInsertTemplateSecao,
  IInsertTemplateCampo, IInsertTemplateCampoOpcao,
} from '@/shared/interfaces/supabase';

/**
 * Serviço de Templates de Serviço.
 * Estrutura aninhada: Template → Seções → Campos → Opções.
 */
export const templateService = {

  async listar(filtros?: { nome?: string; ativo?: boolean }) {
    let query = supabaseBrowser
      .from('templates')
      .select('id, nome, formula_calculo, valor_base_venda, ativo, criado_em')
      .order('nome', { ascending: true });

    if (filtros?.nome) query = query.ilike('nome', `%${filtros.nome}%`);

    const ativo = filtros?.ativo !== undefined ? filtros.ativo : true;
    query = query.eq('ativo', ativo);

    return query;
  },

  /** Template completo com seções, campos, opções e add-ons — para renderizar o formulário */
  async buscarCompleto(id: string) {
    return supabaseBrowser
      .from('templates')
      .select(`
        *,
        secoes:template_secoes (
          *,
          campos:template_campos (
            *,
            opcoes_lista:template_campo_opcoes ( * )
          )
        ),
        template_addons!template_id ( addon_id )
      `)
      .eq('id', id)
      // IMPORTANTE: usar o alias definido no select acima, não o nome original da tabela.
      // PostgREST exige consistência entre o alias do select e o referencedTable do order.
      // Para nested relations, o supabase-js espera o caminho com os pontilhados dos pais.
      .order('ordem', { referencedTable: 'secoes', ascending: true })
      .order('ordem', { referencedTable: 'secoes.campos', ascending: true })
      .order('ordem', { referencedTable: 'secoes.campos.opcoes_lista', ascending: true })
      .single<IDbTemplateCompleto>();
  },

  async listarCompletos() {
    return supabaseBrowser
      .from('templates')
      .select(`
        *,
        secoes:template_secoes (
          *,
          campos:template_campos (
            *,
            opcoes_lista:template_campo_opcoes ( * )
          )
        ),
        template_addons!template_id ( addon_id )
      `)
      .eq('ativo', true)
      // IMPORTANTE: usar os aliases definidos no select acima e pontilhado para os aninhados.
      .order('nome',  { ascending: true })
      .order('ordem', { referencedTable: 'secoes', ascending: true })
      .order('ordem', { referencedTable: 'secoes.campos', ascending: true })
      .order('ordem', { referencedTable: 'secoes.campos.opcoes_lista', ascending: true });
  },

  async criar(dados: IInsertTemplate) {
    return supabaseBrowser
      .from('templates')
      .insert(dados)
      .select()
      .single<IDbTemplate>();
  },

  async atualizar(id: string, dados: IUpdateTemplate) {
    return supabaseBrowser
      .from('templates')
      .update(dados)
      .eq('id', id)
      .select()
      .single<IDbTemplate>();
  },

  async desativar(id: string) {
    return supabaseBrowser.from('templates').update({ ativo: false }).eq('id', id);
  },

  // ─── Seções ─────────────────────────────────────────────────────────────────
  async criarSecao(dados: IInsertTemplateSecao) {
    return supabaseBrowser.from('template_secoes').insert(dados).select().single();
  },
  async atualizarSecao(id: string, dados: { nome?: string; ordem?: number }) {
    return supabaseBrowser.from('template_secoes').update(dados).eq('id', id).select().single();
  },
  async deletarSecao(id: string) {
    return supabaseBrowser.from('template_secoes').delete().eq('id', id);
  },

  // ─── Campos ─────────────────────────────────────────────────────────────────
  async criarCampo(dados: IInsertTemplateCampo) {
    return supabaseBrowser.from('template_campos').insert(dados).select().single();
  },
  async atualizarCampo(id: string, dados: Partial<IInsertTemplateCampo>) {
    return supabaseBrowser.from('template_campos').update(dados).eq('id', id).select().single();
  },
  async deletarCampo(id: string) {
    return supabaseBrowser.from('template_campos').delete().eq('id', id);
  },

  // ─── Opções ──────────────────────────────────────────────────────────────────
  async criarOpcao(dados: IInsertTemplateCampoOpcao) {
    return supabaseBrowser.from('template_campo_opcoes').insert(dados).select().single();
  },
  async atualizarOpcao(id: string, dados: Partial<IInsertTemplateCampoOpcao>) {
    return supabaseBrowser.from('template_campo_opcoes').update(dados).eq('id', id).select().single();
  },
  async deletarOpcao(id: string) {
    return supabaseBrowser.from('template_campo_opcoes').delete().eq('id', id);
  },

  // ─── Add-ons ─────────────────────────────────────────────────────────────────
  async adicionarAddon(templateId: string, addonId: string) {
    return supabaseBrowser.from('template_addons').insert({ template_id: templateId, addon_id: addonId });
  },
  async removerAddon(templateId: string, addonId: string) {
    return supabaseBrowser.from('template_addons').delete()
      .eq('template_id', templateId).eq('addon_id', addonId);
  },
};
