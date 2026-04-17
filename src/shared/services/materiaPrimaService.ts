import { supabaseBrowser } from '@/shared/lib/supabase';
import type {
  IDbMateriaPrima, IInsertMateriaPrima, IUpdateMateriaPrima,
  IDbCategoriaMateriaPrima, IInsertCategoriaMateriaPrima, IUpdateCategoriaMateriaPrima,
} from '@/shared/interfaces/supabase';

// ─── Categorias ───────────────────────────────────────────────────────────────
export const categoriaMateriaPrimaService = {

  async listar() {
    return supabaseBrowser
      .from('categorias_materia_prima')
      .select('*')
      .order('nome', { ascending: true });
  },

  async criar(dados: IInsertCategoriaMateriaPrima) {
    return supabaseBrowser
      .from('categorias_materia_prima')
      .insert(dados)
      .select()
      .single<IDbCategoriaMateriaPrima>();
  },

  async atualizar(id: string, dados: IUpdateCategoriaMateriaPrima) {
    return supabaseBrowser
      .from('categorias_materia_prima')
      .update(dados)
      .eq('id', id)
      .select()
      .single<IDbCategoriaMateriaPrima>();
  },

  async deletar(id: string) {
    // Banco retorna erro se houver matéria prima vinculada (ON DELETE RESTRICT)
    return supabaseBrowser
      .from('categorias_materia_prima')
      .delete()
      .eq('id', id);
  },
};

// ─── Matéria Prima ────────────────────────────────────────────────────────────
export const materiaPrimaService = {

  async listar(filtros?: { categoriaId?: string; nome?: string; ativo?: boolean }) {
    let query = supabaseBrowser
      .from('materias_primas')
      .select('*, categoria:categorias_materia_prima ( id, nome, cor )')
      .order('nome', { ascending: true });

    if (filtros?.categoriaId) query = query.eq('categoria_id', filtros.categoriaId);
    if (filtros?.nome) query = query.ilike('nome', `%${filtros.nome}%`);

    const ativo = filtros?.ativo !== undefined ? filtros.ativo : true;
    query = query.eq('ativo', ativo);

    return query;
  },

  /** Listagem por nome de categoria — usada nos campos SELECAO_GRUPO dos templates */
  async listarPorCategoriaNome(nomeCategoria: string) {
    return supabaseBrowser
      .from('materias_primas')
      .select('id, nome, preco_unidade, unidade_medida, categoria:categorias_materia_prima!inner ( nome )')
      .eq('categorias_materia_prima.nome', nomeCategoria)
      .eq('ativo', true)
      .order('nome', { ascending: true });
  },

  async buscarPorId(id: string) {
    return supabaseBrowser
      .from('materias_primas')
      .select('*, categoria:categorias_materia_prima ( id, nome, cor )')
      .eq('id', id)
      .single<IDbMateriaPrima>();
  },

  async criar(dados: IInsertMateriaPrima) {
    return supabaseBrowser
      .from('materias_primas')
      .insert(dados)
      .select()
      .single<IDbMateriaPrima>();
  },

  async atualizar(id: string, dados: IUpdateMateriaPrima) {
    return supabaseBrowser
      .from('materias_primas')
      .update(dados)
      .eq('id', id)
      .select()
      .single<IDbMateriaPrima>();
  },

  async desativar(id: string) {
    return supabaseBrowser
      .from('materias_primas')
      .update({ ativo: false })
      .eq('id', id);
  },
};
