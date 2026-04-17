// ============================================================
// DADOS MOCKADOS / ESTÁTICOS CENTRALIZADOS
// Mover para serviços reais conforme o backend for implementado
// ============================================================

// ------------------------------------------------------------------
// Dashboard – FunilCard
// ------------------------------------------------------------------
export const mockFunilData = [
    { label: 'Criados', value: 10, color: '#4F4F4F', width: 100, suffix: ' orçamentos' },
    { label: 'Enviados', value: 7, color: '#3B82F6', width: 70, suffix: ' enviados' },
    { label: 'Visualizados', value: 6, color: '#8B5CF6', width: 60, suffix: ' lidos' },
    { label: 'Aprovados', value: 4, color: '#10B981', width: 40, suffix: ' aprovados' },
    { label: 'Perdidos', value: 1, color: '#EF4444', width: 10, suffix: '' },
];

// ------------------------------------------------------------------
// Dashboard – ClientesCard
// ------------------------------------------------------------------
export const mockClientes = [
    { id: 'CH', name: 'Clínica Hero', osInfo: 'OS #5 - Fachada ACM Premium · 3 dias sem resposta', amount: 'R$ 4.553', status: 'Urgente', color: '#8B5CF6' },
    { id: 'CA', name: 'Camila Arquiteta', osInfo: 'OS #3 e #4 - Enviada + Rascunho', amount: 'R$ 1.548', status: 'Em andamento', color: '#10B981' },
    { id: 'SS', name: 'Saulo Singular', osInfo: 'OS #1 e #2 - Em criação + Rascunho', amount: 'R$ 1.942', status: 'Em andamento', color: '#1E3A8A' },
    { id: 'MG', name: 'MegaStore', osInfo: 'OS #12 - Em Produção', amount: 'R$ 4.800', status: 'Aprovado', color: '#6EE7B7', colorText: '#047857' },
];

// ------------------------------------------------------------------
// Dashboard – TaxaConversaoCard
// ------------------------------------------------------------------
export const mockTaxaConversaoData = [
    { name: 'Convertidos', value: 4, color: '#10B981' },
    { name: 'Pendentes', value: 3, color: '#F59E0B' },
    { name: 'Perdidos', value: 1, color: '#EF4444' },
];

// ------------------------------------------------------------------
// Dashboard – ReceitaCard
// ------------------------------------------------------------------
export const mockReceitaMes = {
    mes: 'Março 2026',
    totalReceita: 'R$ 12.400',
    comparacaoMesAnterior: { percentual: 18, valorAnterior: 'R$ 10.500', positivo: true },
    faturado: 'R$ 7.042',
    emPipeline: 'R$ 8.042',
    ticketMedio: 'R$ 2.481',
    metaMensal: 'R$ 20k',
};

// ------------------------------------------------------------------
// Dashboard – AcoesRapidasCard
// ------------------------------------------------------------------
export const mockAcoesRapidas = [
    { iconBg: '#EEF2FF', iconColor: '#3B82F6', titulo: 'Enviar Orçamento', subtitulo: '3 rascunhos prontos para envio' },
    { iconBg: '#ECFDF5', iconColor: '#10B981', titulo: 'Follow-up WhatsApp', subtitulo: 'Clínica Hero - 3 dias sem resposta' },
    { iconBg: '#FFFBEB', iconColor: '#F59E0B', titulo: 'Novo Orçamento', subtitulo: 'Usar template de produto' },
    { iconBg: '#F3F4F6', iconColor: '#6B7280', titulo: 'Ver Relatório Mensal', subtitulo: 'Performance de março/2026' },
];

// ------------------------------------------------------------------
// Matéria Prima – categorias (opções do select)
// ------------------------------------------------------------------
export const CATEGORIAS_MATERIA_PRIMA = [
    { value: 'ACM', label: 'ACM' },
    { value: 'Adesivo', label: 'Adesivo' },
    { value: 'Tinta', label: 'Tinta' },
    { value: 'Verniz', label: 'Verniz' },
    { value: 'PS', label: 'PS' },
    { value: 'Fixação', label: 'Fixação' },
    { value: 'Outro', label: 'Outro' },
];

/** Versão com opção "Todas" para uso nos filtros de listagem */
export const CATEGORIAS_MATERIA_PRIMA_FILTER = [
    { value: 'ALL', label: 'Todas Categorias' },
    ...CATEGORIAS_MATERIA_PRIMA,
];

// ------------------------------------------------------------------
// Matéria Prima – estoque padrão (useMateriaPrima › defaultMateriasPrimas)
// ------------------------------------------------------------------
export const defaultMateriasPrimas = [
    { id: 'mp_acm_preto_3mm', nome: 'Chapa ACM Preto Fosco 3mm', descricao: 'Chapa de Alumínio Composto 1.22x5.00m', precoUnidade: 370.0, qtdeEstoque: 15, categoria: 'ACM' },
    { id: 'mp_acm_branco_3mm', nome: 'Chapa ACM Branco 3mm', descricao: 'Chapa de Alumínio Composto 1.22x5.00m', precoUnidade: 350.0, qtdeEstoque: 22, categoria: 'ACM' },
    { id: 'mp_vinil_brilho', nome: 'Adesivo Vinil Branco Brilho', descricao: 'Rolo de Adesivo 1.22x50m para impressão digital', precoUnidade: 550.0, qtdeEstoque: 5, categoria: 'Adesivo' },
    { id: 'mp_vinil_transparente', nome: 'Adesivo Vinil Transparente', descricao: 'Rolo de Adesivo 1.22x50m', precoUnidade: 580.0, qtdeEstoque: 3, categoria: 'Adesivo' },
    { id: 'mp_tinta_eco', nome: 'Tinta Eco-Solvente Cyan 1L', descricao: 'Tinta para plotter de impressão', precoUnidade: 120.0, qtdeEstoque: 10, categoria: 'Tinta' },
    { id: 'mp_verniz_auto', nome: 'Verniz Automotivo PU', descricao: 'Galão 3.6L para acabamento de precisão', precoUnidade: 180.0, qtdeEstoque: 8, categoria: 'Verniz' },
    { id: 'mp_fita_dupla_face', nome: 'Fita Dupla Face VHB 19mm', descricao: 'Rolo de 20 metros para fixação de ACM e Acrílico', precoUnidade: 45.0, qtdeEstoque: 30, categoria: 'Fixação' },
    { id: 'mp_tubo_metal', nome: 'Tubo Metalon 20x20mm', descricao: 'Barra de 6 metros, espessura 1.2mm para estruturas', precoUnidade: 65.0, qtdeEstoque: 50, categoria: 'Outro' },
    { id: 'mp_ps_1mm', nome: 'Chapa PS 1mm', descricao: 'Poliestireno de alto impacto', precoUnidade: 45.0, qtdeEstoque: 20, categoria: 'PS' },
    { id: 'mp_ps_2mm', nome: 'Chapa PS 2mm', descricao: 'Poliestireno de alto impacto', precoUnidade: 80.0, qtdeEstoque: 20, categoria: 'PS' },
    { id: 'mp_ps_3mm', nome: 'Chapa PS 3mm', descricao: 'Poliestireno de alto impacto', precoUnidade: 120.0, qtdeEstoque: 15, categoria: 'PS' },
    { id: 'mp_ps_4mm', nome: 'Chapa PS 4mm', descricao: 'Poliestireno de alto impacto', precoUnidade: 170.0, qtdeEstoque: 10, categoria: 'PS' },
    { id: 'mp_parafuso', nome: 'Parafuso', descricao: 'Unidade de Parafuso Sextavado/Philips', precoUnidade: 0.5, qtdeEstoque: 500, categoria: 'Fixação' },
    { id: 'mp_bucha', nome: 'Bucha', descricao: 'Unidade de Bucha Plástica', precoUnidade: 0.3, qtdeEstoque: 500, categoria: 'Fixação' },
    { id: 'mp_ventosa', nome: 'Ventosa', descricao: 'Ventosa de Silicone', precoUnidade: 2.0, qtdeEstoque: 100, categoria: 'Fixação' },
    { id: 'mp_prolongador', nome: 'Prolongador', descricao: 'Prolongador Aço Inox', precoUnidade: 15.0, qtdeEstoque: 50, categoria: 'Fixação' },
    { id: 'mp_cola_pu', nome: 'Cola PU', descricao: 'Tubo Selante PU', precoUnidade: 28.0, qtdeEstoque: 15, categoria: 'Fixação' },
];

// ------------------------------------------------------------------
// Templates de orçamento – padrão (useTemplate › defaultTemplates)
// ------------------------------------------------------------------
export const defaultTemplates = [
    {
        id: 'tpl_adesivo_impresso',
        nome: 'Adesivo Impresso (Metro Quadrado)',
        formulaCalculo: 'M2',
        valorBaseVenda: 65.0,
        secoes: [
            {
                id: 'sec_adesivo_1',
                nome: 'Material e Acabamento',
                campos: [
                    { id: 'cmp_tipo_adesivo', titulo: 'Qual o Adesivo Base?', tipoCalculo: 'M2', tipoEntrada: 'SELECAO_GRUPO', categoriaMateriaPrima: 'Adesivo' },
                    { id: 'cmp_laminacao', titulo: 'Terá Laminação Protetora?', tipoCalculo: 'M2', tipoEntrada: 'SIM_NAO', valorVendaAdicional: 25.0 },
                    { id: 'cmp_tinta_extra', titulo: 'Alta Carga de Tinta?', tipoCalculo: 'M2', tipoEntrada: 'SIM_NAO', valorVendaAdicional: 10.0 },
                ],
            },
        ],
        addons: [],
    },
    {
        id: 'tpl_letra_caixa',
        nome: 'Letra Caixa Iluminada (Metro Quadrado)',
        formulaCalculo: 'M2',
        valorBaseVenda: 850.0,
        secoes: [
            {
                id: 'sec_letra_1',
                nome: 'Caixa e Face',
                campos: [
                    {
                        id: 'cmp_material_caixa',
                        titulo: 'Material da Lateral',
                        tipoCalculo: 'M2',
                        tipoEntrada: 'LISTA_OPCOES',
                        opcoesLista: [
                            { id: 'opt1', nome: 'Aço Galvanizado Pintado', valorAdicional: 0 },
                            { id: 'opt2', nome: 'Aço Inox Escovado', valorAdicional: 200 },
                            { id: 'opt3', nome: 'Acrílico 3mm', valorAdicional: 150 },
                        ],
                    },
                    { id: 'cmp_tem_iluminacao', titulo: 'Terá Iluminação em LED?', tipoCalculo: 'M2', tipoEntrada: 'SIM_NAO', valorVendaAdicional: 0 },
                    {
                        id: 'cmp_modulo_led',
                        titulo: 'Tipo de Módulo LED',
                        tipoCalculo: 'M2',
                        tipoEntrada: 'LISTA_OPCOES',
                        opcoesLista: [
                            { id: 'optL1', nome: 'Super LED Branco Frio', valorAdicional: 120 },
                            { id: 'optL2', nome: 'Super LED RGB (Com controle)', valorAdicional: 250 },
                        ],
                        condicaoVisibilidade: { campoReferencia: 'Terá Iluminação em LED?', valorEsperado: 'SIM' },
                    },
                ],
            },
        ],
        addons: [],
    },
    {
        id: 'tpl_painel_acm',
        nome: 'Fachada em Painel ACM',
        formulaCalculo: 'M2',
        valorBaseVenda: 450.0,
        secoes: [
            {
                id: 'sec_fachada_estrut',
                nome: 'Estruturação',
                campos: [
                    { id: 'cmp_revestimento', titulo: 'Revestimento ACM', tipoCalculo: 'M2', tipoEntrada: 'SELECAO_GRUPO', categoriaMateriaPrima: 'ACM' },
                    { id: 'cmp_metalon', titulo: 'Estrutura Interna (Metalon)', tipoCalculo: 'ML', tipoEntrada: 'SELECAO_GRUPO', categoriaMateriaPrima: 'Outro' },
                ],
            },
            {
                id: 'sec_fachada_frontal',
                nome: 'Detalhes Frontais',
                campos: [
                    { id: 'cmp_usa_letra', titulo: 'Aplicar Letras de Relevo?', tipoCalculo: 'UN', tipoEntrada: 'SIM_NAO' },
                    { id: 'cmp_letra_ref', titulo: 'Template de Letra Caixa', tipoCalculo: 'UN', tipoEntrada: 'TEMPLATE', templateId: 'tpl_letra_caixa', condicaoVisibilidade: { campoReferencia: 'Aplicar Letras de Relevo?', valorEsperado: 'SIM' } },
                    { id: 'cmp_altura_letra', titulo: 'Altura das Letras (metros)', tipoCalculo: 'UN', tipoEntrada: 'ENTRADA_MANUAL', condicaoVisibilidade: { campoReferencia: 'Aplicar Letras de Relevo?', valorEsperado: 'SIM' } },
                ],
            },
        ],
        addons: ['tpl_adesivo_impresso'],
    },
    {
        id: 'tpl_placa_ps',
        nome: 'Placa PS (Adesivada)',
        formulaCalculo: 'M2',
        valorBaseVenda: 0,
        secoes: [
            {
                id: 'sec_ps_esp',
                nome: 'Material e Chapa',
                campos: [
                    { id: 'cmp_ps_chapa', titulo: 'Espessura do PS', tipoCalculo: 'M2', tipoEntrada: 'SELECAO_GRUPO', categoriaMateriaPrima: 'PS' },
                    { id: 'cmp_ps_acabamento', titulo: 'Acabamento / Dobramento', tipoCalculo: 'UN', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_ps_a1', nome: 'Sem Acabamento (Refilado)', valorAdicional: 0 }, { id: 'opt_ps_a2', nome: 'Com Dobramento', valorAdicional: 35 }] },
                ],
            },
            {
                id: 'sec_ps_corte',
                nome: 'Corte e Formato',
                campos: [
                    { id: 'cmp_ps_corte', titulo: 'Formato de Corte', tipoCalculo: 'UN', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_c1', nome: 'Corte Reto Manual', valorAdicional: 0 }, { id: 'opt_c2', nome: 'Corte Especial / Laser', valorAdicional: 45 }, { id: 'opt_c3', nome: 'Corte Router CNC', valorAdicional: 55 }] },
                ],
            },
            {
                id: 'sec_ps_fix',
                nome: 'Fixação',
                campos: [
                    { id: 'cmp_ps_fixacao', titulo: 'Tipo de Fixação', tipoCalculo: 'UN', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_f1', nome: 'Fita Dupla Face', valorAdicional: 20 }, { id: 'opt_f2', nome: 'Parafusos (Kit)', valorAdicional: 15 }, { id: 'opt_f3', nome: 'Buchas e Parafusos', valorAdicional: 25 }, { id: 'opt_f4', nome: 'Ventosas (Vidro)', valorAdicional: 30 }, { id: 'opt_f5', nome: 'Prolongadores Inox', valorAdicional: 120 }, { id: 'opt_f6', nome: 'Cola PU', valorAdicional: 45 }] },
                ],
            },
        ],
        addons: ['tpl_adesivo_impresso'],
    },
    {
        id: 'tpl_servico_entrega',
        nome: 'Serviço de Entrega (Transporte)',
        formulaCalculo: 'QTDE',
        valorBaseVenda: 0,
        secoes: [
            {
                id: 'sec_logistica',
                nome: 'Logística',
                campos: [
                    { id: 'cmp_tipo_veiculo', titulo: 'Tipo de Veículo', tipoCalculo: 'UN', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_v1', nome: 'Moto', valorAdicional: 0 }, { id: 'opt_v2', nome: 'Carro / Utilitário Pequeno', valorAdicional: 0 }, { id: 'opt_v3', nome: 'Caminhão Leve', valorAdicional: 0 }] },
                    { id: 'cmp_km_moto', titulo: 'Distância em Km (Moto)', tipoCalculo: 'QTDE', tipoEntrada: 'ENTRADA_MANUAL', valorVendaAdicional: 0.29, condicaoVisibilidade: { campoReferencia: 'Tipo de Veículo', valorEsperado: 'Moto' } },
                    { id: 'cmp_km_carro', titulo: 'Distância em Km (Carro)', tipoCalculo: 'QTDE', tipoEntrada: 'ENTRADA_MANUAL', valorVendaAdicional: 0.59, condicaoVisibilidade: { campoReferencia: 'Tipo de Veículo', valorEsperado: 'Carro / Utilitário Pequeno' } },
                    { id: 'cmp_km_caminhao', titulo: 'Distância em Km (Caminhão)', tipoCalculo: 'QTDE', tipoEntrada: 'ENTRADA_MANUAL', valorVendaAdicional: 5.99, condicaoVisibilidade: { campoReferencia: 'Tipo de Veículo', valorEsperado: 'Caminhão Leve' } },
                ],
            },
            {
                id: 'sec_equipe_apoio',
                nome: 'Equipe de Apoio',
                campos: [
                    { id: 'cmp_precisa_ajudante', titulo: 'Necessita de Ajudante?', tipoCalculo: 'UN', tipoEntrada: 'SIM_NAO' },
                    { id: 'cmp_qtde_ajudantes', titulo: 'Quantidade de Colaboradores', tipoCalculo: 'UN', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_a1', nome: '1 Ajudante', valorAdicional: 80 }, { id: 'opt_a2', nome: '2 Ajudantes', valorAdicional: 160 }, { id: 'opt_a3', nome: '3 Ajudantes', valorAdicional: 240 }], condicaoVisibilidade: { campoReferencia: 'Necessita de Ajudante?', valorEsperado: 'SIM' } },
                ],
            },
        ],
        addons: [],
    },
    {
        id: 'tpl_bancada_marmore',
        nome: 'Bancada de Mármore/Granito (Cozinha e Banheiro)',
        formulaCalculo: 'M2',
        valorBaseVenda: 0,
        secoes: [
            {
                id: 'sec_pedra',
                nome: 'Material Base (M²)',
                campos: [
                    { id: 'cmp_tipo_pedra_dinamica', titulo: 'Qual a Pedra?', tipoCalculo: 'M2', tipoEntrada: 'TEMPLATE', templateId: 'tpl_tabela_marmore' },
                ],
            },
            {
                id: 'sec_acabamento',
                nome: 'Acabamentos e Bordas (ML - Metro Linear)',
                campos: [
                    { id: 'cmp_saia', titulo: 'Acabamento da Borda Frontal (Saia/Frontão)', tipoCalculo: 'ML', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_b1', nome: 'Borda Reta Simples 2cm', valorAdicional: 45.0 }, { id: 'opt_b2', nome: 'Meia Esquadria 45º 4cm', valorAdicional: 80.0 }, { id: 'opt_b3', nome: 'Saia Dupla 4cm', valorAdicional: 120.0 }] },
                    { id: 'cmp_tem_rodabanca', titulo: 'Terá Rodabanca (Parede)?', tipoCalculo: 'ML', tipoEntrada: 'SIM_NAO', valorVendaAdicional: 35.0 },
                ],
            },
            {
                id: 'sec_recortes',
                nome: 'Serviços Especiais e Recortes (UN - Quantidade)',
                campos: [
                    { id: 'cmp_recorte_cuba', titulo: 'Recorte Interno para Cuba/Pia', tipoCalculo: 'UN', tipoEntrada: 'SIM_NAO', valorVendaAdicional: 150.0 },
                    { id: 'cmp_furos', titulo: 'Furos para Torneira/Dispenser (Qtde)', tipoCalculo: 'QTDE', tipoEntrada: 'ENTRADA_MANUAL', valorVendaAdicional: 35.0 },
                ],
            },
        ],
        addons: ['tpl_servico_entrega'],
    },
    {
        id: 'tpl_tabela_marmore',
        nome: '[TABELA DE PREÇOS] Pedras e Granitos',
        formulaCalculo: 'UN',
        valorBaseVenda: 0,
        secoes: [
            {
                id: 'sec_lista_pedras',
                nome: 'Estoque Centralizado de Pedras',
                campos: [
                    { id: 'cmp_escolha_pedra', titulo: 'Selecione a Pedra do Projeto:', tipoCalculo: 'UN', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'p1', nome: 'Granito Preto São Gabriel', valorAdicional: 450.0 }, { id: 'p2', nome: 'Granito Verde Ubatuba', valorAdicional: 380.0 }, { id: 'p3', nome: 'Mármore Travertino', valorAdicional: 680.0 }, { id: 'p4', nome: 'Quartzo Branco Estelar', valorAdicional: 1200.0 }, { id: 'p5', nome: 'Silestone Cinza Expo', valorAdicional: 1550.0 }] },
                ],
            },
        ],
        addons: [],
    },
    {
        id: 'tpl_fachada_acm_luminosa',
        nome: 'Fachada em ACM Premium (Composição Avançada)',
        formulaCalculo: 'M2',
        valorBaseVenda: 0,
        secoes: [
            {
                id: 'sec_estrutura_revestimento',
                nome: 'Estruturação e Revestimento (M²)',
                campos: [
                    { id: 'cmp_acm_tipo', titulo: 'Cor / Textura do ACM', tipoCalculo: 'M2', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_acm1', nome: 'ACM Branco/Preto Brilho', valorAdicional: 280.0 }, { id: 'opt_acm2', nome: 'ACM Escovado (Prata/Ouro)', valorAdicional: 390.0 }, { id: 'opt_acm3', nome: 'ACM Amadeirado', valorAdicional: 420.0 }] },
                ],
            },
            {
                id: 'sec_elementos_3d',
                nome: 'Letreiros e Logotipos 3D',
                campos: [
                    { id: 'cmp_tem_letra_caixa', titulo: 'Terá Letra Caixa Iluminada?', tipoCalculo: 'UN', tipoEntrada: 'SIM_NAO' },
                    { id: 'cmp_letra_caixa_dinamica', titulo: 'Configuração da Letra Caixa Principal', tipoCalculo: 'M2', tipoEntrada: 'TEMPLATE', templateId: 'tpl_letra_caixa', condicaoVisibilidade: { campoReferencia: 'Terá Letra Caixa Iluminada?', valorEsperado: 'SIM' } },
                    { id: 'cmp_tem_logo_acrilico', titulo: 'Terá Aplique de Acrílico (Logo Secundária)?', tipoCalculo: 'UN', tipoEntrada: 'SIM_NAO' },
                    { id: 'cmp_espessura_acrilico', titulo: 'Espessura do Acrílico (Apenas do Logo)', tipoCalculo: 'M2', tipoEntrada: 'LISTA_OPCOES', opcoesLista: [{ id: 'opt_acr1', nome: 'Acrílico 2mm (Corte Laser)', valorAdicional: 250.0 }, { id: 'opt_acr2', nome: 'Acrílico 5mm (Corte Laser)', valorAdicional: 450.0 }, { id: 'opt_acr3', nome: 'Acrílico 10mm (Corte CNC)', valorAdicional: 850.0 }], condicaoVisibilidade: { campoReferencia: 'Terá Aplique de Acrílico (Logo Secundária)?', valorEsperado: 'SIM' } },
                ],
            },
            {
                id: 'sec_iluminacao_extra',
                nome: 'Iluminação Externa Auxiliar',
                campos: [
                    { id: 'cmp_tem_refletores', titulo: 'Adicionar Refletores de LED Externos?', tipoCalculo: 'UN', tipoEntrada: 'SIM_NAO' },
                    { id: 'cmp_qtde_refletores', titulo: 'Quantidade de Refletores (50W)', tipoCalculo: 'QTDE', tipoEntrada: 'ENTRADA_MANUAL', valorVendaAdicional: 185.0, condicaoVisibilidade: { campoReferencia: 'Adicionar Refletores de LED Externos?', valorEsperado: 'SIM' } },
                ],
            },
        ],
        addons: ['tpl_servico_entrega'],
    },
];

// ------------------------------------------------------------------
// Orçamento – status options (useOrcamento › statusOptions)
// ------------------------------------------------------------------
export const defaultStatusOptions = [
    { id: 'RASCUNHO',    label: 'Rascunho / Em Digitação',                 color: '#94a3b8', order: 0 },
    { id: 'CRIAÇÃO',     label: 'Criação / Arte',                           color: '#c084fc', order: 1 },
    { id: 'ENVIADO',     label: 'Enviado ao Cliente',                       color: '#3b82f6', order: 2 },
    { id: 'APROVADO',    label: 'Aprovado / Comercial',                     color: '#10b981', order: 3 },
    { id: 'PRODUCAO',    label: 'Em Produção (Serralharia / Imps)',         color: '#f59e0b', order: 4 },
    { id: 'INSTALACAO',  label: 'Em Instalação',                            color: '#14b8a6', order: 5 },
    { id: 'CONCLUIDO',   label: 'Finalizado / Entregue',                    color: '#092147', order: 6 },
    { id: 'REJEITADO',   label: 'Perdido / Rejeitado',                      color: '#ef4444', order: 7 },
];

// ------------------------------------------------------------------
// Orçamento – tipos de follow-up padrão (useOrcamento › tiposFollowup)
// ------------------------------------------------------------------
export const defaultTiposFollowup = [
    { id: 'PADRAO_3_7_15',    nome: 'Ativo Básico (3, 7 e 15 dias)',  descricao: 'Cadência padrão de contato via IA/WhatsApp' },
    { id: 'APENAS_IA_SEMANAL', nome: 'Apenas IA Semanal',              descricao: 'Apenas lembretes passivos 1x por semana' },
];

// ------------------------------------------------------------------
// Sidebar – itens de navegação
// ------------------------------------------------------------------
export const NAV_ITEMS = [
    { href: '/', label: 'Início' },
    { href: '/orcamentos', label: 'Orçamentos' },
    { href: '/kanban', label: 'Kanban' },
    { href: '/materiaprima', label: 'Matéria Prima' },
    { href: '/templates', label: 'Templates' },
];
