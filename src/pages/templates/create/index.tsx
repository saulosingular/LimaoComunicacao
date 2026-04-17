import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useDashboard } from '@/hooks/useDashboard';
import { useTemplate } from '@/hooks/useTemplate';
import { useMateriaPrima } from '@/hooks/useMateriaPrima';
import { ITemplateDTO } from '@/shared/interfaces/template';
import type { ICategoriaDTO } from '@/shared/interfaces/materiaPrima';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import {
    FormContainer,
    SectionTitle,
    Row,
    SectionCard,
    CampoCard,
    RemoveButtonAbsolute,
    FlexEndRow
} from './styles';

// ─── Tipos ──────────────────────────────────────────────────────────────────

/**
 * Tipo de Cálculo disponível para templates e campos.
 * MULTIPLICA_TOTAL = multiplicador aplicado sobre o valor total do item.
 */
type TTipoCalculo = 'UN' | 'M2' | 'ML' | 'QTDE' | 'MULTIPLICA_TOTAL';

/**
 * Tipo de entrada disponível para os campos de um template.
 */
type TTipoEntrada = 'SELECAO_GRUPO' | 'ENTRADA_MANUAL' | 'SIM_NAO' | 'LISTA_OPCOES' | 'TEMPLATE';

/** Opções disponíveis para campo "Tipo de Cálculo / Fórmula" */
const OPCOES_TIPO_CALCULO: { value: TTipoCalculo; label: string }[] = [
    { value: 'M2',              label: 'Metro Quadrado (M²)' },
    { value: 'ML',              label: 'Metro Linear (ML)' },
    { value: 'UN',              label: 'Unitário (UN)' },
    { value: 'QTDE',            label: 'Quantidade Específica' },
    { value: 'MULTIPLICA_TOTAL', label: 'Multiplicador do Total (×)' },
];

/** Opções disponíveis para campo "Tipo de Entrada do Campo" */
const OPCOES_TIPO_ENTRADA: { value: TTipoEntrada; label: string }[] = [
    { value: 'SELECAO_GRUPO',  label: 'Matéria Prima (Seleção de Grupo)' },
    { value: 'ENTRADA_MANUAL', label: 'Valor Manual (Digitação)' },
    { value: 'SIM_NAO',        label: 'Opção Sim / Não' },
    { value: 'LISTA_OPCOES',   label: 'Lista de Opções' },
    { value: 'TEMPLATE',       label: 'Sub-Template (Acoplado)' },
];

// ─── Schema de validação Yup ────────────────────────────────────────────────

/**
 * Lista de valores aceitos para validação Yup — inclui TODOS os tipos de cálculo.
 * Manter sincronizado com OPCOES_TIPO_CALCULO acima.
 */
const VALORES_TIPO_CALCULO: [TTipoCalculo, ...TTipoCalculo[]] = [
    'UN', 'M2', 'ML', 'QTDE', 'MULTIPLICA_TOTAL'
];

const VALORES_TIPO_ENTRADA: [TTipoEntrada, ...TTipoEntrada[]] = [
    'SELECAO_GRUPO', 'ENTRADA_MANUAL', 'SIM_NAO', 'LISTA_OPCOES', 'TEMPLATE'
];

const schema = yup.object().shape({
    nome: yup.string().required('Nome do template é obrigatório'),
    formulaCalculo: yup.string()
        .oneOf(VALORES_TIPO_CALCULO, 'Fórmula de cálculo inválida')
        .required('Fórmula de cálculo é obrigatória'),
    valorBaseVenda: yup.number()
        .transform((value, orig) => String(orig).trim() === '' ? null : value)
        .required('Valor base de venda é obrigatório')
        .min(0, 'O valor base não pode ser negativo'),
    secoes: yup.array().of(
        yup.object().shape({
            nome: yup.string().required('Nome da seção é obrigatório'),
            campos: yup.array().of(
                yup.object().shape({
                    titulo: yup.string().required('Título do campo é obrigatório'),
                    tipoCalculo: yup.string()
                        .oneOf(VALORES_TIPO_CALCULO, 'Tipo de cálculo inválido')
                        .required('Tipo de cálculo é obrigatório'),
                    tipoEntrada: yup.string()
                        .oneOf(VALORES_TIPO_ENTRADA, 'Tipo de entrada inválido')
                        .required('Tipo de entrada é obrigatório'),
                    // Categoria de Matéria Prima (ID da categoria) é obrigatório apenas quando tipoEntrada = SELECAO_GRUPO
                    categoriaMateriaPrima: yup.string().when('tipoEntrada', {
                        is: 'SELECAO_GRUPO',
                        then: (sch) => sch.required('Selecione a categoria de matéria prima'),
                        otherwise: (sch) => sch.notRequired(),
                    }),
                    // ID do sub-template é obrigatório apenas quando tipoEntrada = TEMPLATE
                    templateId: yup.string().when('tipoEntrada', {
                        is: 'TEMPLATE',
                        then: (sch) => sch.required('Selecione um template'),
                        otherwise: (sch) => sch.notRequired(),
                    }),
                    valorVendaAdicional: yup.number()
                        .transform((val, orig) => String(orig).trim() === '' ? 0 : val)
                        .notRequired(),
                    // Lista de opções é obrigatória (mínimo 1) apenas quando tipoEntrada = LISTA_OPCOES
                    opcoesLista: yup.array().when('tipoEntrada', {
                        is: 'LISTA_OPCOES',
                        then: (sch) => sch.of(
                            yup.object().shape({
                                nome: yup.string().required('Nome da opção é obrigatório'),
                                valorAdicional: yup.number()
                                    .transform((val, orig) => String(orig).trim() === '' ? 0 : val)
                                    .notRequired(),
                            })
                        ).min(1, 'Adicione pelo menos uma opção para a lista'),
                        otherwise: (sch) => sch.notRequired(),
                    }),
                    condicaoVisibilidade: yup.object().shape({
                        campoReferencia: yup.string().optional(),
                        valorEsperado: yup.string().optional(),
                    }).notRequired().default(undefined),
                })
            ).min(1, 'Adicione pelo menos um campo na seção').required(),
        })
    ).min(1, 'Adicione pelo menos uma seção ao template').required(),
    addons: yup.array().of(yup.string()).optional().default([]),
});

// ─── Página principal ───────────────────────────────────────────────────────

export default function CreateTemplatePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('id'); // ID do template em edição (null = criação)

    const { setTitlePage } = useDashboard();
    const { templates, addTemplate, updateTemplate, fetchTemplates } = useTemplate();
    const categorias = useMateriaPrima((s) => s.categorias);
    const fetchCategorias = useMateriaPrima((s) => s.fetchCategorias);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nome: '',
            formulaCalculo: 'M2' as TTipoCalculo,
            valorBaseVenda: 0,
            addons: [],
            secoes: [{
                nome: '',
                campos: [{
                    titulo: '',
                    tipoCalculo: 'M2' as TTipoCalculo,
                    tipoEntrada: 'SELECAO_GRUPO' as TTipoEntrada,
                    categoriaMateriaPrima: '',
                    templateId: '',
                    valorVendaAdicional: 0,
                    condicaoVisibilidade: { campoReferencia: '', valorEsperado: '' },
                }],
            }],
        },
    });

    // Field array para as seções do template
    const {
        fields: secaoFields,
        append: adicionarSecao,
        remove: removerSecao,
        swap: reordenarSecao,
    } = useFieldArray({ control, name: 'secoes' });

    // ─── Data fetching ──────────────────────────────────────────────────────

    useEffect(() => {
        setTitlePage(templateId ? 'Editar Template' : 'Novo Template');
        fetchTemplates();
        fetchCategorias();
    }, [setTitlePage, fetchTemplates, fetchCategorias]);

    // Preenche o formulário ao editar um template existente
    useEffect(() => {
        if (templateId && templates.length > 0) {
            const templateEncontrado = templates.find(t => t.id === templateId);
            if (templateEncontrado) {
                reset(templateEncontrado as any);
            }
        }
    }, [templateId, templates, reset]);

    // ─── Helpers ────────────────────────────────────────────────────────────

    /**
     * Retorna as opções de categorias de matéria prima para o Select.
     * Usa o ID (UUID) como value e o nome como label — necessário pois o banco
     * armazena a FK "categoria_mp_id" e não o nome textual.
     */
    const getOpcoesCategorias = (): { value: string; label: string }[] => {
        if (categorias.length === 0) {
            return [{ value: '', label: 'Nenhuma categoria cadastrada ainda' }];
        }
        return categorias.map((c: ICategoriaDTO) => ({ value: c.id, label: c.nome }));
    };

    /**
     * Retorna os outros templates disponíveis para uso como sub-template (add-on).
     * Exclui o template atual da lista para evitar referência circular.
     */
    const getOutrosTemplates = () => {
        return templates
            .filter(t => t.id !== templateId)
            .map(t => ({ value: t.id, label: t.nome }));
    };

    // ─── Handlers ───────────────────────────────────────────────────────────

    const onSubmit = async (data: any) => {
        // Garante que seções e campos recebem um ID antes de persistir
        const dadosFormatados: Omit<ITemplateDTO, 'id'> = {
            ...data,
            addons: data.addons || [],
            secoes: data.secoes.map((secao: any) => ({
                ...secao,
                id: secao.id || crypto.randomUUID(),
                campos: secao.campos.map((campo: any) => ({
                    ...campo,
                    id: campo.id || crypto.randomUUID(),
                })),
            })),
        };

        try {
            if (templateId) {
                await updateTemplate(templateId, dadosFormatados);
                toast.success('Template atualizado com sucesso!');
            } else {
                await addTemplate(dadosFormatados);
                toast.success('Template criado com sucesso!');
            }
            navigate('/templates');
        } catch {
            toast.error('Erro ao salvar template. Verifique os dados e tente novamente.');
        }
    };

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <FlexEndRow style={{ marginTop: 0, marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Voltar para Templates
                </Button>
            </FlexEndRow>

            <FormContainer onSubmit={handleSubmit(onSubmit)}>

                {/* ── Informações Gerais ── */}
                <SectionTitle>Informações Gerais do Template</SectionTitle>
                <Row>
                    <Input
                        {...register('nome')}
                        label="Nome do Template"
                        placeholder="Ex: Fachada de ACM, Letreiro Luminoso..."
                        error={errors.nome?.message}
                    />
                    <Select
                        {...register('formulaCalculo')}
                        label="Fórmula de Cálculo do Template"
                        options={OPCOES_TIPO_CALCULO}
                        error={errors.formulaCalculo?.message}
                    />
                    <Input
                        {...register('valorBaseVenda')}
                        type="number"
                        step="0.01"
                        label="Valor Base de Venda (por M²/UN)"
                        error={errors.valorBaseVenda?.message}
                    />
                </Row>

                {/* ── Seções de Produção ── */}
                <SectionTitle style={{ marginTop: '2rem' }}>Seções de Produção</SectionTitle>

                {secaoFields.map((secao, sIndex) => (
                    <SectionCard key={secao.id}>
                        {/* Controles de reordenação e exclusão da seção */}
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            {sIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={() => reordenarSecao(sIndex, sIndex - 1)}
                                    style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', padding: 4 }}
                                    title="Mover seção para cima"
                                >
                                    <FiArrowUp size={20} />
                                </button>
                            )}
                            {sIndex < secaoFields.length - 1 && (
                                <button
                                    type="button"
                                    onClick={() => reordenarSecao(sIndex, sIndex + 1)}
                                    style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', padding: 4 }}
                                    title="Mover seção para baixo"
                                >
                                    <FiArrowDown size={20} />
                                </button>
                            )}
                            {secaoFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removerSecao(sIndex)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8, display: 'flex', padding: 4 }}
                                    title="Remover esta seção"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            )}
                        </div>

                        <Input
                            {...register(`secoes.${sIndex}.nome` as const)}
                            label={`Nome da Seção ${sIndex + 1}`}
                            placeholder="Ex: Face Frontal, Estrutura Interna..."
                            error={errors.secoes?.[sIndex]?.nome?.message}
                        />

                        <ListaCamposDaSecao
                            control={control}
                            register={register}
                            errors={errors}
                            secaoIndex={sIndex}
                            watch={watch}
                            opcoesCategorias={getOpcoesCategorias()}
                            outrosTemplates={getOutrosTemplates()}
                        />
                    </SectionCard>
                ))}

                <div style={{ marginTop: '1rem' }}>
                    <Button
                        type="button"
                        variant="outline"
                        customColor="primary"
                        onClick={() => adicionarSecao({
                            nome: '',
                            campos: [{
                                titulo: '',
                                tipoCalculo: 'UN' as TTipoCalculo,
                                tipoEntrada: 'ENTRADA_MANUAL' as TTipoEntrada,
                                valorVendaAdicional: 0,
                                condicaoVisibilidade: { campoReferencia: '', valorEsperado: '' },
                            }],
                        })}
                    >
                        <FiPlus /> Nova Seção
                    </Button>
                </div>

                {/* ── Add-ons / Sub-templates ── */}
                <SectionTitle style={{ marginTop: '2rem' }}>
                    Templates Adicionais (Add-ons / Sub-templates)
                </SectionTitle>
                <SectionCard>
                    <Select
                        {...register('addons')}
                        multiple
                        style={{ height: '140px' }}
                        label="Selecione os templates que podem ser incluídos como complementos deste"
                        options={getOutrosTemplates()}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Pressione <strong>Ctrl</strong> (Windows) ou <strong>Cmd</strong> (Mac) para selecionar múltiplos.
                    </p>
                </SectionCard>

                {/* ── Rodapé de ações ── */}
                <FlexEndRow>
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                    <Button type="submit" customColor="success">
                        <FiSave /> {templateId ? 'Salvar Alterações' : 'Criar Template'}
                    </Button>
                </FlexEndRow>

            </FormContainer>
        </div>
    );
}

// ─── Sub-componente: Lista de campos de uma seção ───────────────────────────

interface ListaCamposDaSecaoProps {
    control: any;
    register: any;
    errors: any;
    secaoIndex: number;
    watch: any;
    opcoesCategorias: { value: string; label: string }[];
    outrosTemplates: { value: string; label: string }[];
}

/**
 * Gerencia o array de campos dentro de uma seção.
 * Renderizado uma vez por seção, responsável por adicionar, remover e exibir campos.
 */
function ListaCamposDaSecao({
    control,
    register,
    errors,
    secaoIndex,
    watch,
    opcoesCategorias,
    outrosTemplates,
}: ListaCamposDaSecaoProps) {
    const {
        fields: campoFields,
        append: adicionarCampo,
        remove: removerCampo,
    } = useFieldArray({
        control,
        name: `secoes.${secaoIndex}.campos`,
    });

    // Coleta todos os campos de todas as seções para montar as opções de "Regra de Visibilidade"
    const todasAsSecoes = watch('secoes') || [];

    /**
     * Monta a lista de campos disponíveis para referência nas regras de visibilidade.
     * Inclui apenas campos que já têm título preenchido.
     * Usa uma chave composta "secaoIndex_campoIndex" para garantir unicidade,
     * mesmo que dois campos em seções diferentes tenham o mesmo título.
     */
    const camposParaReferencia: { chaveUnica: string; titulo: string }[] = [];
    todasAsSecoes.forEach((secao: any, sIdx: number) => {
        (secao.campos || []).forEach((campo: any, cIdx: number) => {
            if (campo.titulo && campo.titulo.trim() !== '') {
                camposParaReferencia.push({
                    chaveUnica: `S${sIdx}_C${cIdx}`, // ex: "S0_C2"
                    titulo: campo.titulo,
                });
            }
        });
    });

    return (
        <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#475569', fontWeight: 600 }}>
                Campos da Seção
            </h4>

            {campoFields.map((campo, cIndex) => {
                const tipoEntradaAtual = watch(`secoes.${secaoIndex}.campos.${cIndex}.tipoEntrada`) as TTipoEntrada;

                return (
                    <CampoCard key={campo.id}>
                        <RemoveButtonAbsolute
                            type="button"
                            onClick={() => removerCampo(cIndex)}
                            aria-label="Remover campo"
                        >
                            <FiTrash2 size={16} />
                        </RemoveButtonAbsolute>

                        {/* Linha 1: Título + Tipo Cálculo + Tipo Entrada */}
                        <Row style={{ marginBottom: '1rem' }}>
                            <Input
                                {...register(`secoes.${secaoIndex}.campos.${cIndex}.titulo`)}
                                label="Título do Campo"
                                placeholder="Ex: Espessura do Acrílico, Cor do Revestimento..."
                                error={errors.secoes?.[secaoIndex]?.campos?.[cIndex]?.titulo?.message}
                            />
                            <Select
                                {...register(`secoes.${secaoIndex}.campos.${cIndex}.tipoCalculo`)}
                                label="Cálculo Aplicado ao Campo"
                                options={OPCOES_TIPO_CALCULO}
                                error={errors.secoes?.[secaoIndex]?.campos?.[cIndex]?.tipoCalculo?.message}
                            />
                            <Select
                                {...register(`secoes.${secaoIndex}.campos.${cIndex}.tipoEntrada`)}
                                label="Tipo de Entrada"
                                options={OPCOES_TIPO_ENTRADA}
                                error={errors.secoes?.[secaoIndex]?.campos?.[cIndex]?.tipoEntrada?.message}
                            />
                        </Row>

                        {/* Linha 2: Campos condicionais ao tipo de entrada */}
                        <Row>
                            {/* Matéria Prima: aparece apenas quando tipoEntrada = SELECAO_GRUPO */}
                            {tipoEntradaAtual === 'SELECAO_GRUPO' && (
                                <Select
                                    {...register(`secoes.${secaoIndex}.campos.${cIndex}.categoriaMateriaPrima`)}
                                    label="Categoria de Matéria Prima"
                                    options={opcoesCategorias}
                                    error={errors.secoes?.[secaoIndex]?.campos?.[cIndex]?.categoriaMateriaPrima?.message}
                                />
                            )}

                            {/* Sub-template: aparece apenas quando tipoEntrada = TEMPLATE */}
                            {tipoEntradaAtual === 'TEMPLATE' && (
                                <Select
                                    {...register(`secoes.${secaoIndex}.campos.${cIndex}.templateId`)}
                                    label="Sub-Template Vinculado"
                                    options={outrosTemplates.length > 0
                                        ? outrosTemplates
                                        : [{ value: '', label: 'Nenhum outro template encontrado' }]
                                    }
                                    error={errors.secoes?.[secaoIndex]?.campos?.[cIndex]?.templateId?.message}
                                />
                            )}

                            <Input
                                {...register(`secoes.${secaoIndex}.campos.${cIndex}.valorVendaAdicional`)}
                                type="number"
                                step="0.01"
                                label="Acréscimo ao Valor de Venda (R$)"
                                placeholder="Ex: 50.00 — deixe 0 se não houver"
                                error={errors.secoes?.[secaoIndex]?.campos?.[cIndex]?.valorVendaAdicional?.message}
                            />
                        </Row>

                        {/* Lista de Opções: aparece apenas quando tipoEntrada = LISTA_OPCOES */}
                        {tipoEntradaAtual === 'LISTA_OPCOES' && (
                            <ListaOpcoesDoCampo
                                control={control}
                                register={register}
                                errors={errors}
                                secaoIndex={secaoIndex}
                                campoIndex={cIndex}
                            />
                        )}

                        {/* Regra de Visibilidade Condicional */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                            <h5 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#6b7280', fontWeight: 600 }}>
                                Regra de Visibilidade — Exibir este campo apenas se... (Opcional)
                            </h5>
                            <Row>
                                <Select
                                    {...register(`secoes.${secaoIndex}.campos.${cIndex}.condicaoVisibilidade.campoReferencia`)}
                                    label="O campo de referência:"
                                    options={[
                                        { value: '', label: 'Sempre visível (sem condição)' },
                                        ...camposParaReferencia.map(ref => ({
                                            // value armazena o TÍTULO do campo (que é o que o motor de regras compara em tempo de execução)
                                            value: ref.titulo,
                                            // label exibe o título + a chave única para evitar confusão entre campos homônimos
                                            label: camposParaReferencia.filter(r => r.titulo === ref.titulo).length > 1
                                                ? `${ref.titulo} (${ref.chaveUnica})`
                                                : ref.titulo,
                                        }))
                                    ]}
                                />
                                <ValorEsperadoDaCondicao
                                    register={register}
                                    camposParaReferencia={camposParaReferencia}
                                    todasAsSecoes={todasAsSecoes}
                                    secaoIndex={secaoIndex}
                                    campoIndex={cIndex}
                                    watch={watch}
                                    outrosTemplates={outrosTemplates}
                                />
                            </Row>
                        </div>
                    </CampoCard>
                );
            })}

            <div style={{ marginTop: '1rem' }}>
                <Button
                    type="button"
                    variant="ghost"
                    customColor="secondary"
                    onClick={() => adicionarCampo({
                        titulo: '',
                        tipoCalculo: 'UN' as TTipoCalculo,
                        tipoEntrada: 'ENTRADA_MANUAL' as TTipoEntrada,
                        valorVendaAdicional: 0,
                        condicaoVisibilidade: { campoReferencia: '', valorEsperado: '' },
                    })}
                >
                    <FiPlus /> Adicionar Campo
                </Button>
            </div>
        </div>
    );
}

// ─── Sub-componente: Valor esperado da condição de visibilidade ─────────────

interface ValorEsperadoDaCondicaoProps {
    register: any;
    camposParaReferencia: { chaveUnica: string; titulo: string }[];
    todasAsSecoes: any[];
    secaoIndex: number;
    campoIndex: number;
    watch: any;
    outrosTemplates: { value: string; label: string }[];
}

/**
 * Renderiza dinamicamente o input correto para o "valor esperado" da regra de visibilidade,
 * com base no tipo de entrada do campo de referência selecionado.
 *
 * Ex: se o campo de referência é SIM_NAO → exibe Select com "SIM / NÃO"
 *     se é LISTA_OPCOES → exibe Select com as opções daquela lista
 *     caso contrário → exibe Input de texto livre
 */
function ValorEsperadoDaCondicao({
    register,
    camposParaReferencia,
    todasAsSecoes,
    secaoIndex,
    campoIndex,
    watch,
    outrosTemplates,
}: ValorEsperadoDaCondicaoProps) {
    const caminhoValorEsperado = `secoes.${secaoIndex}.campos.${campoIndex}.condicaoVisibilidade.valorEsperado`;
    const tituloReferenciado = watch(`secoes.${secaoIndex}.campos.${campoIndex}.condicaoVisibilidade.campoReferencia`);

    // Sem campo de referência selecionado — input texto simples
    if (!tituloReferenciado) {
        return (
            <Input
                {...register(caminhoValorEsperado)}
                label="Tiver o valor:"
                placeholder="Selecione primeiro o campo de referência"
                disabled
            />
        );
    }

    // Localiza o campo referenciado em todas as seções
    let campoReferenciado: any = null;
    for (const secao of todasAsSecoes) {
        const encontrado = (secao.campos || []).find(
            (c: any) => c.titulo === tituloReferenciado
        );
        if (encontrado) { campoReferenciado = encontrado; break; }
    }

    if (!campoReferenciado) {
        return (
            <Input
                {...register(caminhoValorEsperado)}
                label="Tiver o valor:"
                placeholder="Campo de referência não encontrado"
            />
        );
    }

    // Campo referenciado é SIM_NAO
    if (campoReferenciado.tipoEntrada === 'SIM_NAO') {
        return (
            <Select
                {...register(caminhoValorEsperado)}
                label="Tiver o valor:"
                options={[
                    { value: 'SIM', label: 'SIM' },
                    { value: 'NAO', label: 'NÃO' },
                ]}
            />
        );
    }

    // Campo referenciado é LISTA_OPCOES — usa as opções da própria lista
    if (campoReferenciado.tipoEntrada === 'LISTA_OPCOES') {
        const opcoesDisponiveis = (campoReferenciado.opcoesLista || []).map((o: any) => ({
            value: o.nome,
            label: o.nome,
        }));
        return (
            <Select
                {...register(caminhoValorEsperado)}
                label="Tiver o valor:"
                options={opcoesDisponiveis.length > 0
                    ? opcoesDisponiveis
                    : [{ value: '', label: 'Nenhuma opção cadastrada ainda' }]
                }
            />
        );
    }

    // Campo referenciado é TEMPLATE — usa a lista de templates disponíveis
    if (campoReferenciado.tipoEntrada === 'TEMPLATE') {
        return (
            <Select
                {...register(caminhoValorEsperado)}
                label="Tiver o template:"
                options={outrosTemplates.length > 0
                    ? outrosTemplates
                    : [{ value: '', label: 'Nenhum template disponível' }]
                }
            />
        );
    }

    // Fallback para ENTRADA_MANUAL e SELECAO_GRUPO — input texto livre
    return (
        <Input
            {...register(caminhoValorEsperado)}
            label="Tiver o valor:"
            placeholder="Ex: Verde Bandeira, Alumínio Escovado..."
        />
    );
}

// ─── Sub-componente: Lista de opções de um campo LISTA_OPCOES ───────────────

interface ListaOpcoesDoCampoProps {
    control: any;
    register: any;
    errors: any;
    secaoIndex: number;
    campoIndex: number;
}

/**
 * Gerencia o array de opções de um campo do tipo LISTA_OPCOES.
 * Permite adicionar/remover opções e definir valor adicional para cada uma.
 */
function ListaOpcoesDoCampo({
    control,
    register,
    errors,
    secaoIndex,
    campoIndex,
}: ListaOpcoesDoCampoProps) {
    const {
        fields: opcaoFields,
        append: adicionarOpcao,
        remove: removerOpcao,
    } = useFieldArray({
        control,
        name: `secoes.${secaoIndex}.campos.${campoIndex}.opcoesLista`,
    });

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h5 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: '#475569', fontWeight: 600 }}>
                Opções da Lista
            </h5>

            {opcaoFields.map((opcao, oIndex) => (
                <Row key={opcao.id} style={{ marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 2 }}>
                        <Input
                            {...register(`secoes.${secaoIndex}.campos.${campoIndex}.opcoesLista.${oIndex}.nome`)}
                            placeholder="Nome da opção (ex: Branco Fosco)"
                            error={errors.secoes?.[secaoIndex]?.campos?.[campoIndex]?.opcoesLista?.[oIndex]?.nome?.message}
                            widthFull
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Input
                            {...register(`secoes.${secaoIndex}.campos.${campoIndex}.opcoesLista.${oIndex}.valorAdicional`)}
                            type="number"
                            step="0.01"
                            placeholder="Acréscimo em R$ (0 = sem acréscimo)"
                            error={errors.secoes?.[secaoIndex]?.campos?.[campoIndex]?.opcoesLista?.[oIndex]?.valorAdicional?.message}
                            widthFull
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                        <Button
                            type="button"
                            variant="ghost"
                            customColor="danger"
                            onClick={() => removerOpcao(oIndex)}
                            aria-label="Remover opção"
                        >
                            <FiTrash2 size={16} />
                        </Button>
                    </div>
                </Row>
            ))}

            <Button
                type="button"
                variant="outline"
                customColor="primary"
                onClick={() => adicionarOpcao({ nome: '', valorAdicional: 0 })}
                style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}
            >
                <FiPlus size={14} /> Adicionar Opção
            </Button>
        </div>
    );
}
