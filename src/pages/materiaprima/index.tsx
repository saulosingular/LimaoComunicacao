'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useDashboard } from '@/hooks/useDashboard';
import { useMateriaPrima } from '@/hooks/useMateriaPrima';
import { IMateriaPrimaDTO } from '@/shared/interfaces/materiaPrima';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CustomTable, ITableColumn } from '@/components/ui/customTable';
import { ModalMateriaPrima } from './components/ModalMateriaPrima';

import { PageContainer, HeaderActions, FiltersContainer, TableActionsContainer } from './styles';

export default function MateriaPrimaPage() {
    const { setTitlePage } = useDashboard();
    const materiasPrimas = useMateriaPrima((state) => state.materiasPrimas);
    const categorias = useMateriaPrima((state) => state.categorias);
    const loading = useMateriaPrima((state) => state.loading);
    const fetchMateriasPrimas = useMateriaPrima((state) => state.fetchMateriasPrimas);
    const fetchCategorias = useMateriaPrima((state) => state.fetchCategorias);
    const addMateriaPrima = useMateriaPrima((state) => state.addMateriaPrima);
    const updateMateriaPrima = useMateriaPrima((state) => state.updateMateriaPrima);
    const deleteMateriaPrima = useMateriaPrima((state) => state.deleteMateriaPrima);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IMateriaPrimaDTO | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        setTitlePage('Catálogo de Matéria Prima');
        fetchMateriasPrimas();
        fetchCategorias();
    }, [setTitlePage, fetchMateriasPrimas, fetchCategorias]);

    const handleOpenModal = (item?: IMateriaPrimaDTO) => {
        setEditingItem(item || null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (data: Omit<IMateriaPrimaDTO, 'id' | 'categoria'>) => {
        try {
            if (editingItem) {
                await updateMateriaPrima(editingItem.id, data);
                toast.success('Matéria prima atualizada com sucesso!');
            } else {
                await addMateriaPrima(data);
                toast.success('Materia prima cadastrada com sucesso!');
            }
            handleCloseModal();
        } catch {
            toast.error('Erro ao salvar matéria prima.');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Tem certeza que deseja remover esta matéria prima?')) {
            try {
                await deleteMateriaPrima(id);
                toast.info('Removido com sucesso!');
            } catch {
                toast.error('Erro ao remover matéria prima.');
            }
        }
    };

    const columns: ITableColumn<IMateriaPrimaDTO>[] = [
        { key: 'nome', label: 'Nome' },
        { key: 'categoria', label: 'Categoria', width: '150px' },
        {
            key: 'unidadeMedida',
            label: 'Unidade',
            width: '100px',
        },
        {
            key: 'precoUnidade',
            label: 'Preço (UN)',
            width: '150px',
            render: (val) => `R$ ${Number(val).toFixed(2).replace('.', ',')}`
        },
        { key: 'qtdeEstoque', label: 'Estoque', width: '120px' },
        {
            key: 'actions',
            label: 'Ações',
            width: '120px',
            render: (_, row) => (
                <TableActionsContainer>
                    <Button variant="ghost" customColor="info" aria-label="Editar" onClick={(e) => { e.stopPropagation(); handleOpenModal(row); }}>
                        <FiEdit2 />
                    </Button>
                    <Button variant="ghost" customColor="danger" aria-label="Remover" onClick={(e) => handleDelete(row.id, e)}>
                        <FiTrash2 />
                    </Button>
                </TableActionsContainer>
            ),
        },
    ];

    const categoriasOptions = useMemo(() => [
        { value: 'ALL', label: 'Todas Categorias' },
        ...categorias.map(c => ({ value: c.nome, label: c.nome })),
    ], [categorias]);

    const filteredData = useMemo(() => {
        return materiasPrimas.filter((mp) => {
            const matchName = mp.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = categoryFilter === '' || categoryFilter === 'ALL' || mp.categoria === categoryFilter;
            return matchName && matchCategory;
        });
    }, [materiasPrimas, searchTerm, categoryFilter]);

    return (
        <PageContainer>
            <HeaderActions>
                <FiltersContainer>
                    <div style={{ width: '300px' }}>
                        <Input
                            name="search"
                            placeholder="Buscar por nome..."
                            icon={FiSearch}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '250px' }}>
                        <Select
                            name="categoryFilter"
                            options={categoriasOptions}
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        />
                    </div>
                </FiltersContainer>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button customColor="primary" onClick={() => handleOpenModal()}>
                        <FiPlus size={20} />
                        Nova Matéria Prima
                    </Button>
                </div>
            </HeaderActions>

            <CustomTable
                columns={columns}
                data={filteredData}
                emptyMessage={loading ? 'Carregando...' : 'Nenhuma matéria prima encontrada.'}
                onRowClick={(row) => handleOpenModal(row)}
            />

            <ModalMateriaPrima
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                initialData={editingItem}
                categorias={categorias}
            />
        </PageContainer>
    );
}
