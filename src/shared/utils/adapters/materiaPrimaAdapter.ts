import type {
  IDbMateriaPrima,
  IDbCategoriaMateriaPrima,
  IInsertMateriaPrima,
  IUpdateMateriaPrima,
} from '@/shared/interfaces/supabase';
import type { IMateriaPrimaDTO, ICategoriaDTO } from '@/shared/interfaces/materiaPrima';

// ─── Tipo de retorno do service (com join de categoria) ───────────────────────
export type IDbMateriaPrimaComCategoria = IDbMateriaPrima & {
  categoria: Pick<IDbCategoriaMateriaPrima, 'id' | 'nome' | 'cor'> | null;
};

// ─── DB → DTO ─────────────────────────────────────────────────────────────────
export function dbToMateriaPrimaDTO(db: IDbMateriaPrimaComCategoria): IMateriaPrimaDTO {
  return {
    id: db.id,
    nome: db.nome,
    descricao: db.descricao || '',
    precoUnidade: db.preco_unidade,
    qtdeEstoque: db.qtde_estoque,
    unidadeMedida: db.unidade_medida,
    categoria: db.categoria?.nome || '',
    categoriaId: db.categoria_id,
  };
}

// ─── DTO → INSERT ─────────────────────────────────────────────────────────────
export function dtoToInsertMateriaPrima(
  dto: Omit<IMateriaPrimaDTO, 'id' | 'categoria'>,
): IInsertMateriaPrima {
  return {
    categoria_id: dto.categoriaId,
    nome: dto.nome,
    descricao: dto.descricao || null,
    preco_unidade: dto.precoUnidade,
    qtde_estoque: dto.qtdeEstoque,
    unidade_medida: dto.unidadeMedida,
    ativo: true,
  };
}

// ─── DTO → UPDATE ─────────────────────────────────────────────────────────────
export function dtoToUpdateMateriaPrima(
  dto: Partial<IMateriaPrimaDTO>,
): IUpdateMateriaPrima {
  const update: IUpdateMateriaPrima = {};
  if (dto.nome !== undefined) update.nome = dto.nome;
  if (dto.descricao !== undefined) update.descricao = dto.descricao || null;
  if (dto.precoUnidade !== undefined) update.preco_unidade = dto.precoUnidade;
  if (dto.qtdeEstoque !== undefined) update.qtde_estoque = dto.qtdeEstoque;
  if (dto.unidadeMedida !== undefined) update.unidade_medida = dto.unidadeMedida;
  if (dto.categoriaId !== undefined) update.categoria_id = dto.categoriaId;
  return update;
}

// ─── Categorias DB → DTO ──────────────────────────────────────────────────────
export function dbToCategoriaDTO(db: IDbCategoriaMateriaPrima): ICategoriaDTO {
  return {
    id: db.id,
    nome: db.nome,
    cor: db.cor,
  };
}
