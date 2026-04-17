import type { TUnidadeMedida } from '../supabase';

export interface ICategoriaDTO {
  id: string;
  nome: string;
  cor: string | null;
}

export interface IMateriaPrimaDTO {
  id: string;
  nome: string;
  descricao: string;
  precoUnidade: number;
  qtdeEstoque: number;
  unidadeMedida: TUnidadeMedida;
  categoria: string;       // nome da categoria (display)
  categoriaId: string;     // FK para categorias_materia_prima
}
