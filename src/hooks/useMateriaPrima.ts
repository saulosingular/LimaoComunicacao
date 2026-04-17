import { create } from 'zustand';
import { IMateriaPrimaDTO, ICategoriaDTO } from '@/shared/interfaces/materiaPrima';
import { materiaPrimaService, categoriaMateriaPrimaService } from '@/shared/services';
import {
  dbToMateriaPrimaDTO,
  dtoToInsertMateriaPrima,
  dtoToUpdateMateriaPrima,
  dbToCategoriaDTO,
  type IDbMateriaPrimaComCategoria,
} from '@/shared/utils/adapters';

interface IMateriaPrimaState {
  materiasPrimas: IMateriaPrimaDTO[];
  categorias: ICategoriaDTO[];
  loading: boolean;
  error: string | null;

  fetchMateriasPrimas: () => Promise<void>;
  fetchCategorias: () => Promise<void>;
  addMateriaPrima: (item: Omit<IMateriaPrimaDTO, 'id' | 'categoria'>) => Promise<void>;
  updateMateriaPrima: (id: string, data: Partial<IMateriaPrimaDTO>) => Promise<void>;
  deleteMateriaPrima: (id: string) => Promise<void>;
}

export const useMateriaPrima = create<IMateriaPrimaState>()((set, get) => ({
  materiasPrimas: [],
  categorias: [],
  loading: false,
  error: null,

  fetchMateriasPrimas: async () => {
    set({ loading: true, error: null });
    const { data, error } = await materiaPrimaService.listar();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const items = (data as IDbMateriaPrimaComCategoria[] || []).map(dbToMateriaPrimaDTO);
    set({ materiasPrimas: items, loading: false });
  },

  fetchCategorias: async () => {
    const { data, error } = await categoriaMateriaPrimaService.listar();
    console.log('Categorias fetch:', { data, error });
    if (error) return;
    set({ categorias: (data || []).map(dbToCategoriaDTO) });
  },

  addMateriaPrima: async (item) => {
    set({ loading: true, error: null });
    const insertData = dtoToInsertMateriaPrima(item);
    const { error } = await materiaPrimaService.criar(insertData);
    if (error) {
      set({ loading: false, error: error.message });
      throw new Error(error.message);
    }
    // Recarrega lista completa para ter os dados com join de categoria
    await get().fetchMateriasPrimas();
  },

  updateMateriaPrima: async (id, data) => {
    set({ loading: true, error: null });
    const updateData = dtoToUpdateMateriaPrima(data);
    const { error } = await materiaPrimaService.atualizar(id, updateData);
    if (error) {
      set({ loading: false, error: error.message });
      throw new Error(error.message);
    }
    await get().fetchMateriasPrimas();
  },

  deleteMateriaPrima: async (id) => {
    set({ loading: true, error: null });
    const { error } = await materiaPrimaService.desativar(id);
    if (error) {
      set({ loading: false, error: error.message });
      throw new Error(error.message);
    }
    await get().fetchMateriasPrimas();
  },
}));
