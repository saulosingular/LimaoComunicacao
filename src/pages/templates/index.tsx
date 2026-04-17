import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useDashboard } from '@/hooks/useDashboard';
import { useTemplate } from '@/hooks/useTemplate';
import { ITemplateDTO } from '@/shared/interfaces/template';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomTable, ITableColumn } from '@/components/ui/customTable';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';

import { PageContainer, HeaderActions, FiltersContainer, TableActionsContainer } from './styles';

export default function TemplatesPage() {
    const navigate = useNavigate();
    const { setTitlePage } = useDashboard();
    const templates = useTemplate((state) => state.templates);
    const loading = useTemplate((state) => state.loading);
    const fetchTemplates = useTemplate((state) => state.fetchTemplates);
    const deleteTemplate = useTemplate((state) => state.deleteTemplate);

    const [searchTerm, setSearchTerm] = useState('');
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

    useEffect(() => {
        setTitlePage('Catálogo de Templates');
        fetchTemplates();
    }, [setTitlePage, fetchTemplates]);

    const handleEdit = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        navigate(`/templates/create?id=${id}`);
    };

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTemplateToDelete(id);
    };

    const confirmDelete = async () => {
        if (!templateToDelete) return;
        try {
            await deleteTemplate(templateToDelete);
            toast.info('Template removido com sucesso!');
        } catch {
            toast.error('Erro ao remover template.');
        } finally {
            setTemplateToDelete(null);
        }
    };

    const columns: ITableColumn<ITemplateDTO>[] = [
        { key: 'nome', label: 'Nome do Template' },
        { key: 'formulaCalculo', label: 'Fórmula', width: '200px' },
        {
            key: 'valorBaseVenda',
            label: 'Valor Base (M²)',
            width: '180px',
            render: (val) => `R$ ${Number(val).toFixed(2).replace('.', ',')}`
        },
        {
            key: 'actions',
            label: 'Ações',
            width: '120px',
            render: (_, row) => (
                <TableActionsContainer>
                    <Button variant="ghost" customColor="info" aria-label="Editar" onClick={(e) => handleEdit(row.id, e)}>
                        <FiEdit2 />
                    </Button>
                    <Button variant="ghost" customColor="danger" aria-label="Remover" onClick={(e) => handleDeleteClick(row.id, e)}>
                        <FiTrash2 />
                    </Button>
                </TableActionsContainer>
            ),
        },
    ];

    const filteredData = useMemo(() => {
        return templates.filter((tpl) =>
            tpl.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [templates, searchTerm]);

    return (
        <PageContainer>
            <HeaderActions>
                <FiltersContainer>
                    <div style={{ width: '350px' }}>
                        <Input
                            name="search"
                            placeholder="Buscar templates..."
                            icon={FiSearch}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </FiltersContainer>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button customColor="primary" onClick={() => navigate('/templates/create')}>
                        <FiPlus size={20} />
                        Novo Template
                    </Button>
                </div>
            </HeaderActions>

            <CustomTable
                columns={columns}
                data={filteredData}
                emptyMessage={loading ? 'Carregando...' : 'Nenhum template encontrado.'}
                onRowClick={(row) => handleEdit(row.id)}
            />

            <ConfirmModal
                isOpen={!!templateToDelete}
                title="Remover Template"
                message="Tem certeza que deseja remover este template? Ele ficará oculto em futuras criações de OS, mas ordens passadas continuarão a exibi-lo."
                onConfirm={confirmDelete}
                onCancel={() => setTemplateToDelete(null)}
            />
        </PageContainer>
    );
}
