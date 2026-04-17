-- ============================================================
-- SEED — Dados de exemplo (gerado a partir de data-example.ts)
-- Empresa: Singular Comunicação Visual
-- Data de referência: 2026-03-03
-- ============================================================
-- ANTES DE EXECUTAR:
--   1. Substitua v_usuario_id pelo UUID real do usuário em auth.users
--   2. Execute no SQL Editor do Supabase com permissão de service_role
--      (para ignorar RLS durante o seed)
-- ============================================================

do $$
declare
  -- ── Empresa ──────────────────────────────────────────────
  v_empresa        uuid := 'a1b2c3d4-0001-0000-0000-000000000001';

  -- ── Usuário (substitua pelo UUID real do auth.users) ──────
  v_usuario_id     uuid := 'a1b2c3d4-0099-0000-0000-000000000099';

  -- ── Categorias de Matéria Prima ──────────────────────────
  v_cat_acm        uuid := 'a1b2c3d4-0101-0000-0000-000000000001';
  v_cat_adesivo    uuid := 'a1b2c3d4-0101-0000-0000-000000000002';
  v_cat_tinta      uuid := 'a1b2c3d4-0101-0000-0000-000000000003';
  v_cat_verniz     uuid := 'a1b2c3d4-0101-0000-0000-000000000004';
  v_cat_fixacao    uuid := 'a1b2c3d4-0101-0000-0000-000000000005';
  v_cat_ps         uuid := 'a1b2c3d4-0101-0000-0000-000000000006';
  v_cat_outro      uuid := 'a1b2c3d4-0101-0000-0000-000000000007';

  -- ── Matérias Primas ──────────────────────────────────────
  v_mp_acm_preto   uuid := 'a1b2c3d4-0201-0000-0000-000000000001';
  v_mp_acm_branco  uuid := 'a1b2c3d4-0201-0000-0000-000000000002';
  v_mp_vinil_brilho       uuid := 'a1b2c3d4-0201-0000-0000-000000000003';
  v_mp_vinil_transp       uuid := 'a1b2c3d4-0201-0000-0000-000000000004';
  v_mp_tinta_eco          uuid := 'a1b2c3d4-0201-0000-0000-000000000005';
  v_mp_verniz_auto        uuid := 'a1b2c3d4-0201-0000-0000-000000000006';
  v_mp_fita_dupla         uuid := 'a1b2c3d4-0201-0000-0000-000000000007';
  v_mp_tubo_metal         uuid := 'a1b2c3d4-0201-0000-0000-000000000008';
  v_mp_ps_1mm             uuid := 'a1b2c3d4-0201-0000-0000-000000000009';
  v_mp_ps_2mm             uuid := 'a1b2c3d4-0201-0000-0000-000000000010';
  v_mp_ps_3mm             uuid := 'a1b2c3d4-0201-0000-0000-000000000011';
  v_mp_ps_4mm             uuid := 'a1b2c3d4-0201-0000-0000-000000000012';
  v_mp_parafuso           uuid := 'a1b2c3d4-0201-0000-0000-000000000013';
  v_mp_bucha              uuid := 'a1b2c3d4-0201-0000-0000-000000000014';
  v_mp_ventosa            uuid := 'a1b2c3d4-0201-0000-0000-000000000015';
  v_mp_prolongador        uuid := 'a1b2c3d4-0201-0000-0000-000000000016';
  v_mp_cola_pu            uuid := 'a1b2c3d4-0201-0000-0000-000000000017';

  -- ── Clientes ─────────────────────────────────────────────
  v_cli_clinica_hero      uuid := 'a1b2c3d4-0301-0000-0000-000000000001';
  v_cli_camila            uuid := 'a1b2c3d4-0301-0000-0000-000000000002';
  v_cli_saulo             uuid := 'a1b2c3d4-0301-0000-0000-000000000003';
  v_cli_megastore         uuid := 'a1b2c3d4-0301-0000-0000-000000000004';

  -- ── Status de Orçamento ──────────────────────────────────
  -- (usa codigo text, não precisa de UUID para FK lógica)

  -- ── Tipos de Follow-up ───────────────────────────────────
  v_tf_padrao             uuid := 'a1b2c3d4-0401-0000-0000-000000000001';
  v_tf_ia_semanal         uuid := 'a1b2c3d4-0401-0000-0000-000000000002';

  -- ── Templates ────────────────────────────────────────────
  v_tpl_adesivo           uuid := 'a1b2c3d4-0501-0000-0000-000000000001';
  v_tpl_letra_caixa       uuid := 'a1b2c3d4-0501-0000-0000-000000000002';
  v_tpl_painel_acm        uuid := 'a1b2c3d4-0501-0000-0000-000000000003';
  v_tpl_placa_ps          uuid := 'a1b2c3d4-0501-0000-0000-000000000004';
  v_tpl_entrega           uuid := 'a1b2c3d4-0501-0000-0000-000000000005';
  v_tpl_bancada_marmore   uuid := 'a1b2c3d4-0501-0000-0000-000000000006';
  v_tpl_tabela_marmore    uuid := 'a1b2c3d4-0501-0000-0000-000000000007';
  v_tpl_fachada_luminosa  uuid := 'a1b2c3d4-0501-0000-0000-000000000008';

  -- ── Seções de Template ───────────────────────────────────
  v_sec_ades_1            uuid := 'a1b2c3d4-0601-0000-0000-000000000001';
  v_sec_letra_1           uuid := 'a1b2c3d4-0601-0000-0000-000000000002';
  v_sec_acm_estrut        uuid := 'a1b2c3d4-0601-0000-0000-000000000003';
  v_sec_acm_frontal       uuid := 'a1b2c3d4-0601-0000-0000-000000000004';
  v_sec_ps_esp            uuid := 'a1b2c3d4-0601-0000-0000-000000000005';
  v_sec_ps_corte          uuid := 'a1b2c3d4-0601-0000-0000-000000000006';
  v_sec_ps_fix            uuid := 'a1b2c3d4-0601-0000-0000-000000000007';
  v_sec_entrega_log       uuid := 'a1b2c3d4-0601-0000-0000-000000000008';
  v_sec_entrega_equipe    uuid := 'a1b2c3d4-0601-0000-0000-000000000009';
  v_sec_bancada_pedra     uuid := 'a1b2c3d4-0601-0000-0000-000000000010';
  v_sec_bancada_acab      uuid := 'a1b2c3d4-0601-0000-0000-000000000011';
  v_sec_bancada_recortes  uuid := 'a1b2c3d4-0601-0000-0000-000000000012';
  v_sec_tabela_pedras     uuid := 'a1b2c3d4-0601-0000-0000-000000000013';
  v_sec_fachada_revestim  uuid := 'a1b2c3d4-0601-0000-0000-000000000014';
  v_sec_fachada_3d        uuid := 'a1b2c3d4-0601-0000-0000-000000000015';
  v_sec_fachada_ilum      uuid := 'a1b2c3d4-0601-0000-0000-000000000016';

  -- ── Campos de Template ───────────────────────────────────
  -- tpl_adesivo_impresso
  v_cmp_tipo_adesivo      uuid := 'a1b2c3d4-0701-0000-0000-000000000001';
  v_cmp_laminacao         uuid := 'a1b2c3d4-0701-0000-0000-000000000002';
  v_cmp_tinta_extra       uuid := 'a1b2c3d4-0701-0000-0000-000000000003';
  -- tpl_letra_caixa
  v_cmp_mat_caixa         uuid := 'a1b2c3d4-0701-0000-0000-000000000004';
  v_cmp_tem_ilum          uuid := 'a1b2c3d4-0701-0000-0000-000000000005';
  v_cmp_modulo_led        uuid := 'a1b2c3d4-0701-0000-0000-000000000006';
  -- tpl_painel_acm
  v_cmp_revestimento      uuid := 'a1b2c3d4-0701-0000-0000-000000000007';
  v_cmp_metalon           uuid := 'a1b2c3d4-0701-0000-0000-000000000008';
  v_cmp_usa_letra         uuid := 'a1b2c3d4-0701-0000-0000-000000000009';
  v_cmp_letra_ref         uuid := 'a1b2c3d4-0701-0000-0000-000000000010';
  v_cmp_altura_letra      uuid := 'a1b2c3d4-0701-0000-0000-000000000011';
  -- tpl_placa_ps
  v_cmp_ps_chapa          uuid := 'a1b2c3d4-0701-0000-0000-000000000012';
  v_cmp_ps_acabamento     uuid := 'a1b2c3d4-0701-0000-0000-000000000013';
  v_cmp_ps_corte          uuid := 'a1b2c3d4-0701-0000-0000-000000000014';
  v_cmp_ps_fixacao        uuid := 'a1b2c3d4-0701-0000-0000-000000000015';
  -- tpl_servico_entrega
  v_cmp_tipo_veiculo      uuid := 'a1b2c3d4-0701-0000-0000-000000000016';
  v_cmp_km_moto           uuid := 'a1b2c3d4-0701-0000-0000-000000000017';
  v_cmp_km_carro          uuid := 'a1b2c3d4-0701-0000-0000-000000000018';
  v_cmp_km_caminhao       uuid := 'a1b2c3d4-0701-0000-0000-000000000019';
  v_cmp_ajudante          uuid := 'a1b2c3d4-0701-0000-0000-000000000020';
  v_cmp_qtde_ajudantes    uuid := 'a1b2c3d4-0701-0000-0000-000000000021';
  -- tpl_bancada_marmore
  v_cmp_tipo_pedra        uuid := 'a1b2c3d4-0701-0000-0000-000000000022';
  v_cmp_saia              uuid := 'a1b2c3d4-0701-0000-0000-000000000023';
  v_cmp_tem_rodabanca     uuid := 'a1b2c3d4-0701-0000-0000-000000000024';
  v_cmp_recorte_cuba      uuid := 'a1b2c3d4-0701-0000-0000-000000000025';
  v_cmp_furos             uuid := 'a1b2c3d4-0701-0000-0000-000000000026';
  -- tpl_tabela_marmore
  v_cmp_escolha_pedra     uuid := 'a1b2c3d4-0701-0000-0000-000000000027';
  -- tpl_fachada_acm_luminosa
  v_cmp_acm_tipo          uuid := 'a1b2c3d4-0701-0000-0000-000000000028';
  v_cmp_tem_letra_caixa   uuid := 'a1b2c3d4-0701-0000-0000-000000000029';
  v_cmp_letra_caixa_din   uuid := 'a1b2c3d4-0701-0000-0000-000000000030';
  v_cmp_tem_logo_acril    uuid := 'a1b2c3d4-0701-0000-0000-000000000031';
  v_cmp_espessura_acril   uuid := 'a1b2c3d4-0701-0000-0000-000000000032';
  v_cmp_tem_refletores    uuid := 'a1b2c3d4-0701-0000-0000-000000000033';
  v_cmp_qtde_refletores   uuid := 'a1b2c3d4-0701-0000-0000-000000000034';

  -- ── Orçamentos ───────────────────────────────────────────
  v_os_01  uuid := 'a1b2c3d4-0801-0000-0000-000000000001';
  v_os_02  uuid := 'a1b2c3d4-0801-0000-0000-000000000002';
  v_os_03  uuid := 'a1b2c3d4-0801-0000-0000-000000000003';
  v_os_04  uuid := 'a1b2c3d4-0801-0000-0000-000000000004';
  v_os_05  uuid := 'a1b2c3d4-0801-0000-0000-000000000005';
  v_os_12  uuid := 'a1b2c3d4-0801-0000-0000-000000000012';

begin

  -- ============================================================
  -- BLOCO 1 — EMPRESA
  -- ============================================================
  insert into public.empresas (id, nome, cnpj, email, telefone) values
    (v_empresa, 'Singular Comunicação Visual', '12.345.678/0001-99',
     'contato@singularcv.com.br', '(11) 91234-5678')
  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 2 — USUÁRIO
  -- ============================================================
  -- ATENÇÃO: Insira primeiro o usuário no Supabase Auth e substitua
  -- v_usuario_id pelo UUID real retornado pelo auth.
  insert into public.usuarios (id, empresa_id, nome, cargo) values
    (v_usuario_id, v_empresa, 'Saulo Singular', 'ADMIN')
  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 3 — CATEGORIAS DE MATÉRIA PRIMA
  -- ============================================================
  insert into public.categorias_materia_prima (id, empresa_id, nome, cor) values
    (v_cat_acm,     v_empresa, 'ACM',     '#1e40af'),
    (v_cat_adesivo, v_empresa, 'Adesivo', '#7c3aed'),
    (v_cat_tinta,   v_empresa, 'Tinta',   '#0891b2'),
    (v_cat_verniz,  v_empresa, 'Verniz',  '#059669'),
    (v_cat_fixacao, v_empresa, 'Fixação', '#d97706'),
    (v_cat_ps,      v_empresa, 'PS',      '#be185d'),
    (v_cat_outro,   v_empresa, 'Outro',   '#6b7280')
  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 4 — MATÉRIAS PRIMAS
  -- ============================================================
  insert into public.materias_primas
    (id, empresa_id, categoria_id, nome, descricao, preco_unidade, qtde_estoque, unidade_medida) values
    (v_mp_acm_preto,    v_empresa, v_cat_acm,
      'Chapa ACM Preto Fosco 3mm',
      'Chapa de Alumínio Composto 1.22x5.00m',
      370.00, 15, 'M2'),
    (v_mp_acm_branco,   v_empresa, v_cat_acm,
      'Chapa ACM Branco 3mm',
      'Chapa de Alumínio Composto 1.22x5.00m',
      350.00, 22, 'M2'),
    (v_mp_vinil_brilho, v_empresa, v_cat_adesivo,
      'Adesivo Vinil Branco Brilho',
      'Rolo de Adesivo 1.22x50m para impressão digital',
      550.00, 5, 'ROLO'),
    (v_mp_vinil_transp, v_empresa, v_cat_adesivo,
      'Adesivo Vinil Transparente',
      'Rolo de Adesivo 1.22x50m',
      580.00, 3, 'ROLO'),
    (v_mp_tinta_eco,    v_empresa, v_cat_tinta,
      'Tinta Eco-Solvente Cyan 1L',
      'Tinta para plotter de impressão',
      120.00, 10, 'L'),
    (v_mp_verniz_auto,  v_empresa, v_cat_verniz,
      'Verniz Automotivo PU',
      'Galão 3.6L para acabamento de precisão',
      180.00, 8, 'L'),
    (v_mp_fita_dupla,   v_empresa, v_cat_fixacao,
      'Fita Dupla Face VHB 19mm',
      'Rolo de 20 metros para fixação de ACM e Acrílico',
      45.00, 30, 'ROLO'),
    (v_mp_tubo_metal,   v_empresa, v_cat_outro,
      'Tubo Metalon 20x20mm',
      'Barra de 6 metros, espessura 1.2mm para estruturas',
      65.00, 50, 'ML'),
    (v_mp_ps_1mm,       v_empresa, v_cat_ps,
      'Chapa PS 1mm',
      'Poliestireno de alto impacto',
      45.00, 20, 'M2'),
    (v_mp_ps_2mm,       v_empresa, v_cat_ps,
      'Chapa PS 2mm',
      'Poliestireno de alto impacto',
      80.00, 20, 'M2'),
    (v_mp_ps_3mm,       v_empresa, v_cat_ps,
      'Chapa PS 3mm',
      'Poliestireno de alto impacto',
      120.00, 15, 'M2'),
    (v_mp_ps_4mm,       v_empresa, v_cat_ps,
      'Chapa PS 4mm',
      'Poliestireno de alto impacto',
      170.00, 10, 'M2'),
    (v_mp_parafuso,     v_empresa, v_cat_fixacao,
      'Parafuso',
      'Unidade de Parafuso Sextavado/Philips',
      0.50, 500, 'UN'),
    (v_mp_bucha,        v_empresa, v_cat_fixacao,
      'Bucha',
      'Unidade de Bucha Plástica',
      0.30, 500, 'UN'),
    (v_mp_ventosa,      v_empresa, v_cat_fixacao,
      'Ventosa',
      'Ventosa de Silicone',
      2.00, 100, 'UN'),
    (v_mp_prolongador,  v_empresa, v_cat_fixacao,
      'Prolongador',
      'Prolongador Aço Inox',
      15.00, 50, 'UN'),
    (v_mp_cola_pu,      v_empresa, v_cat_fixacao,
      'Cola PU',
      'Tubo Selante PU',
      28.00, 15, 'UN')
  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 5 — STATUS DE ORÇAMENTO
  -- ============================================================
  insert into public.status_orcamento (empresa_id, codigo, label, cor, ordem) values
    (v_empresa, 'RASCUNHO',   'Rascunho / Em Digitação',                 '#94a3b8', 0),
    (v_empresa, 'CRIAÇÃO',    'Criação / Arte',                           '#c084fc', 1),
    (v_empresa, 'ENVIADO',    'Enviado ao Cliente',                       '#3b82f6', 2),
    (v_empresa, 'APROVADO',   'Aprovado / Comercial',                    '#10b981', 3),
    (v_empresa, 'PRODUCAO',   'Em Produção (Serralharia / Imps)',         '#f59e0b', 4),
    (v_empresa, 'INSTALACAO', 'Em Instalação',                            '#14b8a6', 5),
    (v_empresa, 'CONCLUIDO',  'Finalizado / Entregue',                    '#092147', 6),
    (v_empresa, 'REJEITADO',  'Perdido / Rejeitado',                      '#ef4444', 7)
  on conflict (empresa_id, codigo) do nothing;


  -- ============================================================
  -- BLOCO 6 — TIPOS DE FOLLOW-UP
  -- ============================================================
  insert into public.tipos_followup (id, empresa_id, nome, descricao) values
    (v_tf_padrao,     v_empresa,
      'Ativo Básico (3, 7 e 15 dias)',
      'Cadência padrão de contato via IA/WhatsApp'),
    (v_tf_ia_semanal, v_empresa,
      'Apenas IA Semanal',
      'Apenas lembretes passivos 1x por semana')
  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 7 — CONFIGURAÇÕES DA EMPRESA
  -- ============================================================
  insert into public.configuracoes_empresa (empresa_id, chave, valor, mes_ref) values
    (v_empresa, 'META_MENSAL',                '20000', '2026-03'),
    (v_empresa, 'DIAS_VALIDADE_ORCAMENTO',    '30',    null),
    (v_empresa, 'RECEITA_MES_ANTERIOR',       '10500', '2026-02')
  on conflict (empresa_id, chave, mes_ref) do nothing;


  -- ============================================================
  -- BLOCO 8 — CLIENTES
  -- ============================================================
  insert into public.clientes
    (id, empresa_id, nome, whatsapp, tipo_pessoa, origem, observacoes) values
    (v_cli_clinica_hero, v_empresa,
      'Clínica Hero', '(11) 99001-0001', 'PJ',
      'Instagram',
      'Cliente em negociação para fachada ACM Premium. 3 dias sem resposta ao orçamento.'),
    (v_cli_camila, v_empresa,
      'Camila Arquiteta', '(11) 99002-0002', 'PF',
      'Indicação',
      'Arquiteta parceira. Envia projetos recorrentes de clientes.'),
    (v_cli_saulo, v_empresa,
      'Saulo Singular', '(11) 99003-0003', 'PF',
      'Próprio',
      'Sócio da empresa. Projetos internos e demonstrações.'),
    (v_cli_megastore, v_empresa,
      'MegaStore', '(11) 99004-0004', 'PJ',
      'Google',
      'Rede de lojas. Projeto aprovado e em produção.')
  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 9 — TEMPLATES
  -- ============================================================
  insert into public.templates
    (id, empresa_id, nome, formula_calculo, valor_base_venda) values
    (v_tpl_adesivo,          v_empresa, 'Adesivo Impresso (Metro Quadrado)',                 'M2',   65.00),
    (v_tpl_letra_caixa,      v_empresa, 'Letra Caixa Iluminada (Metro Quadrado)',            'M2',  850.00),
    (v_tpl_painel_acm,       v_empresa, 'Fachada em Painel ACM',                             'M2',  450.00),
    (v_tpl_placa_ps,         v_empresa, 'Placa PS (Adesivada)',                               'M2',    0.00),
    (v_tpl_entrega,          v_empresa, 'Serviço de Entrega (Transporte)',                   'QTDE',   0.00),
    (v_tpl_bancada_marmore,  v_empresa, 'Bancada de Mármore/Granito (Cozinha e Banheiro)',   'M2',    0.00),
    (v_tpl_tabela_marmore,   v_empresa, '[TABELA DE PREÇOS] Pedras e Granitos',              'UN',    0.00),
    (v_tpl_fachada_luminosa, v_empresa, 'Fachada em ACM Premium (Composição Avançada)',      'M2',    0.00)
  on conflict (id) do nothing;

  -- ── Add-ons N:N ─────────────────────────────────────────────
  insert into public.template_addons (template_id, addon_id) values
    (v_tpl_painel_acm,       v_tpl_adesivo),
    (v_tpl_placa_ps,         v_tpl_adesivo),
    (v_tpl_bancada_marmore,  v_tpl_entrega),
    (v_tpl_fachada_luminosa, v_tpl_entrega)
  on conflict do nothing;


  -- ============================================================
  -- BLOCO 10 — SEÇÕES DE TEMPLATE
  -- ============================================================
  insert into public.template_secoes (id, template_id, nome, ordem) values
    -- tpl_adesivo_impresso
    (v_sec_ades_1,           v_tpl_adesivo,          'Material e Acabamento',                     0),
    -- tpl_letra_caixa
    (v_sec_letra_1,          v_tpl_letra_caixa,      'Caixa e Face',                              0),
    -- tpl_painel_acm
    (v_sec_acm_estrut,       v_tpl_painel_acm,       'Estruturação',                              0),
    (v_sec_acm_frontal,      v_tpl_painel_acm,       'Detalhes Frontais',                         1),
    -- tpl_placa_ps
    (v_sec_ps_esp,           v_tpl_placa_ps,         'Material e Chapa',                          0),
    (v_sec_ps_corte,         v_tpl_placa_ps,         'Corte e Formato',                           1),
    (v_sec_ps_fix,           v_tpl_placa_ps,         'Fixação',                                   2),
    -- tpl_servico_entrega
    (v_sec_entrega_log,      v_tpl_entrega,          'Logística',                                 0),
    (v_sec_entrega_equipe,   v_tpl_entrega,          'Equipe de Apoio',                           1),
    -- tpl_bancada_marmore
    (v_sec_bancada_pedra,    v_tpl_bancada_marmore,  'Material Base (M²)',                        0),
    (v_sec_bancada_acab,     v_tpl_bancada_marmore,  'Acabamentos e Bordas (ML - Metro Linear)',  1),
    (v_sec_bancada_recortes, v_tpl_bancada_marmore,  'Serviços Especiais e Recortes (UN - Quantidade)', 2),
    -- tpl_tabela_marmore
    (v_sec_tabela_pedras,    v_tpl_tabela_marmore,   'Estoque Centralizado de Pedras',            0),
    -- tpl_fachada_acm_luminosa
    (v_sec_fachada_revestim, v_tpl_fachada_luminosa, 'Estruturação e Revestimento (M²)',          0),
    (v_sec_fachada_3d,       v_tpl_fachada_luminosa, 'Letreiros e Logotipos 3D',                  1),
    (v_sec_fachada_ilum,     v_tpl_fachada_luminosa, 'Iluminação Externa Auxiliar',               2)
  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 11 — CAMPOS DE TEMPLATE
  -- ============================================================
  insert into public.template_campos
    (id, secao_id, titulo, tipo_calculo, tipo_entrada,
     categoria_mp_id, template_ref_id, valor_venda_adicional,
     cond_campo_referencia, cond_valor_esperado, ordem) values

    -- ── tpl_adesivo_impresso / sec_ades_1 ──────────────────
    (v_cmp_tipo_adesivo, v_sec_ades_1,
      'Qual o Adesivo Base?', 'M2', 'SELECAO_GRUPO',
      v_cat_adesivo, null, null, null, null, 0),
    (v_cmp_laminacao, v_sec_ades_1,
      'Terá Laminação Protetora?', 'M2', 'SIM_NAO',
      null, null, 25.00, null, null, 1),
    (v_cmp_tinta_extra, v_sec_ades_1,
      'Alta Carga de Tinta?', 'M2', 'SIM_NAO',
      null, null, 10.00, null, null, 2),

    -- ── tpl_letra_caixa / sec_letra_1 ──────────────────────
    (v_cmp_mat_caixa, v_sec_letra_1,
      'Material da Lateral', 'M2', 'LISTA_OPCOES',
      null, null, null, null, null, 0),
    (v_cmp_tem_ilum, v_sec_letra_1,
      'Terá Iluminação em LED?', 'M2', 'SIM_NAO',
      null, null, null, null, null, 1),
    (v_cmp_modulo_led, v_sec_letra_1,
      'Tipo de Módulo LED', 'M2', 'LISTA_OPCOES',
      null, null, null,
      'Terá Iluminação em LED?', 'SIM', 2),

    -- ── tpl_painel_acm / sec_acm_estrut ────────────────────
    (v_cmp_revestimento, v_sec_acm_estrut,
      'Revestimento ACM', 'M2', 'SELECAO_GRUPO',
      v_cat_acm, null, null, null, null, 0),
    (v_cmp_metalon, v_sec_acm_estrut,
      'Estrutura Interna (Metalon)', 'ML', 'SELECAO_GRUPO',
      v_cat_outro, null, null, null, null, 1),

    -- ── tpl_painel_acm / sec_acm_frontal ───────────────────
    (v_cmp_usa_letra, v_sec_acm_frontal,
      'Aplicar Letras de Relevo?', 'UN', 'SIM_NAO',
      null, null, null, null, null, 0),
    (v_cmp_letra_ref, v_sec_acm_frontal,
      'Template de Letra Caixa', 'UN', 'TEMPLATE',
      null, v_tpl_letra_caixa, null,
      'Aplicar Letras de Relevo?', 'SIM', 1),
    (v_cmp_altura_letra, v_sec_acm_frontal,
      'Altura das Letras (metros)', 'UN', 'ENTRADA_MANUAL',
      null, null, null,
      'Aplicar Letras de Relevo?', 'SIM', 2),

    -- ── tpl_placa_ps / sec_ps_esp ──────────────────────────
    (v_cmp_ps_chapa, v_sec_ps_esp,
      'Espessura do PS', 'M2', 'SELECAO_GRUPO',
      v_cat_ps, null, null, null, null, 0),
    (v_cmp_ps_acabamento, v_sec_ps_esp,
      'Acabamento / Dobramento', 'UN', 'LISTA_OPCOES',
      null, null, null, null, null, 1),

    -- ── tpl_placa_ps / sec_ps_corte ────────────────────────
    (v_cmp_ps_corte, v_sec_ps_corte,
      'Formato de Corte', 'UN', 'LISTA_OPCOES',
      null, null, null, null, null, 0),

    -- ── tpl_placa_ps / sec_ps_fix ──────────────────────────
    (v_cmp_ps_fixacao, v_sec_ps_fix,
      'Tipo de Fixação', 'UN', 'LISTA_OPCOES',
      null, null, null, null, null, 0),

    -- ── tpl_servico_entrega / sec_entrega_log ──────────────
    (v_cmp_tipo_veiculo, v_sec_entrega_log,
      'Tipo de Veículo', 'UN', 'LISTA_OPCOES',
      null, null, null, null, null, 0),
    (v_cmp_km_moto, v_sec_entrega_log,
      'Distância em Km (Moto)', 'QTDE', 'ENTRADA_MANUAL',
      null, null, 0.29,
      'Tipo de Veículo', 'Moto', 1),
    (v_cmp_km_carro, v_sec_entrega_log,
      'Distância em Km (Carro)', 'QTDE', 'ENTRADA_MANUAL',
      null, null, 0.59,
      'Tipo de Veículo', 'Carro / Utilitário Pequeno', 2),
    (v_cmp_km_caminhao, v_sec_entrega_log,
      'Distância em Km (Caminhão)', 'QTDE', 'ENTRADA_MANUAL',
      null, null, 5.99,
      'Tipo de Veículo', 'Caminhão Leve', 3),

    -- ── tpl_servico_entrega / sec_entrega_equipe ───────────
    (v_cmp_ajudante, v_sec_entrega_equipe,
      'Necessita de Ajudante?', 'UN', 'SIM_NAO',
      null, null, null, null, null, 0),
    (v_cmp_qtde_ajudantes, v_sec_entrega_equipe,
      'Quantidade de Colaboradores', 'UN', 'LISTA_OPCOES',
      null, null, null,
      'Necessita de Ajudante?', 'SIM', 1),

    -- ── tpl_bancada_marmore / sec_bancada_pedra ────────────
    (v_cmp_tipo_pedra, v_sec_bancada_pedra,
      'Qual a Pedra?', 'M2', 'TEMPLATE',
      null, v_tpl_tabela_marmore, null, null, null, 0),

    -- ── tpl_bancada_marmore / sec_bancada_acab ─────────────
    (v_cmp_saia, v_sec_bancada_acab,
      'Acabamento da Borda Frontal (Saia/Frontão)', 'ML', 'LISTA_OPCOES',
      null, null, null, null, null, 0),
    (v_cmp_tem_rodabanca, v_sec_bancada_acab,
      'Terá Rodabanca (Parede)?', 'ML', 'SIM_NAO',
      null, null, 35.00, null, null, 1),

    -- ── tpl_bancada_marmore / sec_bancada_recortes ─────────
    (v_cmp_recorte_cuba, v_sec_bancada_recortes,
      'Recorte Interno para Cuba/Pia', 'UN', 'SIM_NAO',
      null, null, 150.00, null, null, 0),
    (v_cmp_furos, v_sec_bancada_recortes,
      'Furos para Torneira/Dispenser (Qtde)', 'QTDE', 'ENTRADA_MANUAL',
      null, null, 35.00, null, null, 1),

    -- ── tpl_tabela_marmore / sec_tabela_pedras ─────────────
    (v_cmp_escolha_pedra, v_sec_tabela_pedras,
      'Selecione a Pedra do Projeto:', 'UN', 'LISTA_OPCOES',
      null, null, null, null, null, 0),

    -- ── tpl_fachada_acm_luminosa / sec_fachada_revestim ────
    (v_cmp_acm_tipo, v_sec_fachada_revestim,
      'Cor / Textura do ACM', 'M2', 'LISTA_OPCOES',
      null, null, null, null, null, 0),

    -- ── tpl_fachada_acm_luminosa / sec_fachada_3d ──────────
    (v_cmp_tem_letra_caixa, v_sec_fachada_3d,
      'Terá Letra Caixa Iluminada?', 'UN', 'SIM_NAO',
      null, null, null, null, null, 0),
    (v_cmp_letra_caixa_din, v_sec_fachada_3d,
      'Configuração da Letra Caixa Principal', 'M2', 'TEMPLATE',
      null, v_tpl_letra_caixa, null,
      'Terá Letra Caixa Iluminada?', 'SIM', 1),
    (v_cmp_tem_logo_acril, v_sec_fachada_3d,
      'Terá Aplique de Acrílico (Logo Secundária)?', 'UN', 'SIM_NAO',
      null, null, null, null, null, 2),
    (v_cmp_espessura_acril, v_sec_fachada_3d,
      'Espessura do Acrílico (Apenas do Logo)', 'M2', 'LISTA_OPCOES',
      null, null, null,
      'Terá Aplique de Acrílico (Logo Secundária)?', 'SIM', 3),

    -- ── tpl_fachada_acm_luminosa / sec_fachada_ilum ────────
    (v_cmp_tem_refletores, v_sec_fachada_ilum,
      'Adicionar Refletores de LED Externos?', 'UN', 'SIM_NAO',
      null, null, null, null, null, 0),
    (v_cmp_qtde_refletores, v_sec_fachada_ilum,
      'Quantidade de Refletores (50W)', 'QTDE', 'ENTRADA_MANUAL',
      null, null, 185.00,
      'Adicionar Refletores de LED Externos?', 'SIM', 1)

  on conflict (id) do nothing;


  -- ============================================================
  -- BLOCO 12 — OPÇÕES DE LISTA DOS CAMPOS
  -- ============================================================
  insert into public.template_campo_opcoes (campo_id, nome, valor_adicional, ordem) values

    -- cmp_mat_caixa (tpl_letra_caixa)
    (v_cmp_mat_caixa, 'Aço Galvanizado Pintado',   0.00,   0),
    (v_cmp_mat_caixa, 'Aço Inox Escovado',        200.00,  1),
    (v_cmp_mat_caixa, 'Acrílico 3mm',             150.00,  2),

    -- cmp_modulo_led (tpl_letra_caixa)
    (v_cmp_modulo_led, 'Super LED Branco Frio',         120.00, 0),
    (v_cmp_modulo_led, 'Super LED RGB (Com controle)',   250.00, 1),

    -- cmp_ps_acabamento (tpl_placa_ps)
    (v_cmp_ps_acabamento, 'Sem Acabamento (Refilado)',  0.00, 0),
    (v_cmp_ps_acabamento, 'Com Dobramento',            35.00, 1),

    -- cmp_ps_corte (tpl_placa_ps)
    (v_cmp_ps_corte, 'Corte Reto Manual',         0.00, 0),
    (v_cmp_ps_corte, 'Corte Especial / Laser',   45.00, 1),
    (v_cmp_ps_corte, 'Corte Router CNC',         55.00, 2),

    -- cmp_ps_fixacao (tpl_placa_ps)
    (v_cmp_ps_fixacao, 'Fita Dupla Face',          20.00, 0),
    (v_cmp_ps_fixacao, 'Parafusos (Kit)',           15.00, 1),
    (v_cmp_ps_fixacao, 'Buchas e Parafusos',        25.00, 2),
    (v_cmp_ps_fixacao, 'Ventosas (Vidro)',          30.00, 3),
    (v_cmp_ps_fixacao, 'Prolongadores Inox',       120.00, 4),
    (v_cmp_ps_fixacao, 'Cola PU',                   45.00, 5),

    -- cmp_tipo_veiculo (tpl_servico_entrega)
    (v_cmp_tipo_veiculo, 'Moto',                     0.00, 0),
    (v_cmp_tipo_veiculo, 'Carro / Utilitário Pequeno', 0.00, 1),
    (v_cmp_tipo_veiculo, 'Caminhão Leve',             0.00, 2),

    -- cmp_qtde_ajudantes (tpl_servico_entrega)
    (v_cmp_qtde_ajudantes, '1 Ajudante',   80.00, 0),
    (v_cmp_qtde_ajudantes, '2 Ajudantes', 160.00, 1),
    (v_cmp_qtde_ajudantes, '3 Ajudantes', 240.00, 2),

    -- cmp_saia (tpl_bancada_marmore)
    (v_cmp_saia, 'Borda Reta Simples 2cm',    45.00, 0),
    (v_cmp_saia, 'Meia Esquadria 45º 4cm',    80.00, 1),
    (v_cmp_saia, 'Saia Dupla 4cm',           120.00, 2),

    -- cmp_escolha_pedra (tpl_tabela_marmore)
    (v_cmp_escolha_pedra, 'Granito Preto São Gabriel',   450.00, 0),
    (v_cmp_escolha_pedra, 'Granito Verde Ubatuba',       380.00, 1),
    (v_cmp_escolha_pedra, 'Mármore Travertino',          680.00, 2),
    (v_cmp_escolha_pedra, 'Quartzo Branco Estelar',     1200.00, 3),
    (v_cmp_escolha_pedra, 'Silestone Cinza Expo',       1550.00, 4),

    -- cmp_acm_tipo (tpl_fachada_acm_luminosa)
    (v_cmp_acm_tipo, 'ACM Branco/Preto Brilho',    280.00, 0),
    (v_cmp_acm_tipo, 'ACM Escovado (Prata/Ouro)',  390.00, 1),
    (v_cmp_acm_tipo, 'ACM Amadeirado',             420.00, 2),

    -- cmp_espessura_acril (tpl_fachada_acm_luminosa)
    (v_cmp_espessura_acril, 'Acrílico 2mm (Corte Laser)',   250.00, 0),
    (v_cmp_espessura_acril, 'Acrílico 5mm (Corte Laser)',   450.00, 1),
    (v_cmp_espessura_acril, 'Acrílico 10mm (Corte CNC)',    850.00, 2);


  -- ============================================================
  -- BLOCO 13 — ORÇAMENTOS (baseado em mockClientes / mockFunilData)
  -- ============================================================
  insert into public.orcamentos
    (id, empresa_id, cliente_id, criado_por,
     numero_os, versao_os, status_codigo,
     data_criacao, data_validade,
     valor_total, condicao_pagamento, origem_cliente,
     tipo_followup_id) values

    -- OS #1 — Saulo Singular — Em Criação
    (v_os_01, v_empresa, v_cli_saulo, v_usuario_id,
     1, 'A', 'CRIAÇÃO',
     '2026-02-25', '2026-03-27',
     1250.00, '50% entrada + 50% na entrega', 'Próprio',
     null),

    -- OS #2 — Saulo Singular — Rascunho (em digitação)
    (v_os_02, v_empresa, v_cli_saulo, v_usuario_id,
     2, 'A', 'RASCUNHO',
     '2026-03-01', '2026-03-31',
     692.00, null, 'Próprio',
     null),

    -- OS #3 — Camila Arquiteta — Enviado
    (v_os_03, v_empresa, v_cli_camila, v_usuario_id,
     3, 'A', 'ENVIADO',
     '2026-02-20', '2026-03-22',
     974.00, 'À vista no boleto', 'Indicação',
     v_tf_padrao),

    -- OS #4 — Camila Arquiteta — Rascunho
    (v_os_04, v_empresa, v_cli_camila, v_usuario_id,
     4, 'A', 'RASCUNHO',
     '2026-03-02', '2026-04-01',
     574.00, null, 'Indicação',
     null),

    -- OS #5 — Clínica Hero — Enviado (3 dias sem resposta)
    (v_os_05, v_empresa, v_cli_clinica_hero, v_usuario_id,
     5, 'A', 'ENVIADO',
     '2026-02-28', '2026-03-30',
     4553.00, '30/60/90 dias', 'Instagram',
     v_tf_padrao),

    -- OS #12 — MegaStore — Em Produção (aprovado)
    (v_os_12, v_empresa, v_cli_megastore, v_usuario_id,
     12, 'A', 'PRODUCAO',
     '2026-02-10', '2026-03-12',
     4800.00, '50% entrada + 50% na entrega', 'Google',
     null)

  on conflict (empresa_id, numero_os, versao_os) do nothing;


  -- ============================================================
  -- BLOCO 14 — ITENS DOS ORÇAMENTOS (snapshot simplificado)
  -- ============================================================
  insert into public.orcamento_itens
    (orcamento_id, template_id, nome_template, sequencia,
     quantidade, largura, altura,
     descricao, valor_total_item) values

    -- OS #1 — Placa PS adesivada
    (v_os_01, v_tpl_placa_ps,
      'Placa PS (Adesivada)', 1,
      1, 1.20, 0.80,
      'Placa PS 3mm com adesivo vinil impresso. Corte reto, fixação fita dupla face.',
      1250.00),

    -- OS #3 — Adesivo Impresso
    (v_os_03, v_tpl_adesivo,
      'Adesivo Impresso (Metro Quadrado)', 1,
      1, 2.50, 0.60,
      'Adesivo vinil branco brilho com laminação protetora para vitrine.',
      974.00),

    -- OS #5 — Fachada ACM Premium
    (v_os_05, v_tpl_fachada_luminosa,
      'Fachada em ACM Premium (Composição Avançada)', 1,
      1, 6.00, 1.80,
      'Fachada ACM amadeirado com letra caixa iluminada LED branco frio. Logo secundária em acrílico 5mm.',
      4553.00),

    -- OS #12 — Painel ACM com letra de relevo + entrega
    (v_os_12, v_tpl_painel_acm,
      'Fachada em Painel ACM', 1,
      1, 8.00, 2.00,
      'Painel ACM branco 3mm com estrutura metalon. Sem letras de relevo.',
      4800.00)

  on conflict do nothing;


  raise notice 'Seed concluído com sucesso para empresa %', v_empresa;

end;
$$;
