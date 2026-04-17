'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from '@/components/structure/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IMateriaPrimaDTO, ICategoriaDTO } from '@/shared/interfaces/materiaPrima';
import type { TUnidadeMedida } from '@/shared/interfaces/supabase';
import { FormContainer, Row } from './styles';

interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<IMateriaPrimaDTO, 'id' | 'categoria'>) => void;
    initialData?: IMateriaPrimaDTO | null;
    categorias: ICategoriaDTO[];
}

const unidadeMedidaOptions = [
    { value: 'UN', label: 'Unidade (UN)' },
    { value: 'M2', label: 'Metro Quadrado (M²)' },
    { value: 'ML', label: 'Metro Linear (ML)' },
    { value: 'KG', label: 'Quilograma (KG)' },
    { value: 'L', label: 'Litro (L)' },
    { value: 'ROLO', label: 'Rolo' },
];

const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório'),
    descricao: yup.string().required('Descrição é obrigatória'),
    precoUnidade: yup.number()
        .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
        .required('Preço é obrigatório')
        .min(0, 'Preço deve ser maior ou igual a zero')
        .typeError('Preço deve ser um número válido'),
    qtdeEstoque: yup.number()
        .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
        .required('Estoque é obrigatório')
        .min(0, 'Estoque deve ser maior ou igual a zero')
        .typeError('Estoque deve ser um número'),
    categoriaId: yup.string().required('Categoria é obrigatória'),
    unidadeMedida: yup.string().oneOf(['UN', 'M2', 'ML', 'KG', 'L', 'ROLO']).required('Unidade é obrigatória'),
});

type FormData = yup.InferType<typeof schema>;

export function ModalMateriaPrima({ isOpen, onClose, onSave, initialData, categorias }: IModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            nome: '',
            descricao: '',
            precoUnidade: 0,
            qtdeEstoque: 0,
            categoriaId: '',
            unidadeMedida: 'UN',
        },
    });

    const categoriasOptions = useMemo(() =>
        categorias.map(c => ({ value: c.id, label: c.nome })),
    [categorias]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    nome: initialData.nome,
                    descricao: initialData.descricao,
                    precoUnidade: initialData.precoUnidade,
                    qtdeEstoque: initialData.qtdeEstoque,
                    categoriaId: initialData.categoriaId,
                    unidadeMedida: initialData.unidadeMedida,
                });
            } else {
                reset({ nome: '', descricao: '', precoUnidade: 0, qtdeEstoque: 0, categoriaId: '', unidadeMedida: 'UN' });
            }
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = (data: FormData) => {
        onSave({
            nome: data.nome,
            descricao: data.descricao,
            precoUnidade: data.precoUnidade,
            qtdeEstoque: data.qtdeEstoque,
            categoriaId: data.categoriaId,
            unidadeMedida: data.unidadeMedida as TUnidadeMedida,
        });
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="solid" customColor="primary" onClick={handleSubmit(onSubmit)}>
                {initialData ? 'Atualizar' : 'Salvar'}
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Editar Matéria Prima' : 'Nova Matéria Prima'}
            width="600px"
            footer={footer}
        >
            <FormContainer id="materiaPrimaForm" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    {...register('nome')}
                    label="Nome"
                    placeholder="Ex: Chapa ACM Branco"
                    error={errors.nome?.message}
                />
                <Input
                    {...register('descricao')}
                    label="Descrição"
                    placeholder="Ex: Chapa branca 3mm 122x500cm"
                    error={errors.descricao?.message}
                />

                <Row>
                    <Select
                        {...register('categoriaId')}
                        label="Categoria"
                        options={categoriasOptions}
                        error={errors.categoriaId?.message}
                    />
                    <Select
                        {...register('unidadeMedida')}
                        label="Unidade de Medida"
                        options={unidadeMedidaOptions}
                        error={errors.unidadeMedida?.message}
                    />
                </Row>

                <Row>
                    <Input
                        {...register('precoUnidade')}
                        type="number"
                        step="0.01"
                        label="Preço por Unidade (R$)"
                        error={errors.precoUnidade?.message}
                    />
                    <Input
                        {...register('qtdeEstoque')}
                        type="number"
                        label="Quantidade Estoque"
                        error={errors.qtdeEstoque?.message}
                    />
                </Row>
            </FormContainer>
        </Modal>
    );
}
