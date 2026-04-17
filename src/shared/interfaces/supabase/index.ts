/**
 * Types TypeScript mapeados diretamente das tabelas do Supabase.
 * - IDb*     → Row completo (retorno do SELECT)
 * - IInsert* → Payload para INSERT
 * - IUpdate* → Payload para UPDATE (Partial do Insert)
 */

// ─── EMPRESA ──────────────────────────────────────────────────────────────────
export interface IDbEmpresa {
  id: string;
  nome: string;
  cnpj: string | null;
  email: string | null;
  telefone: string | null;
  logo_url: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
export type IInsertEmpresa = Omit<IDbEmpresa, 'id' | 'criado_em' | 'atualizado_em'>;
export type IUpdateEmpresa = Partial<IInsertEmpresa>;

// ─── USUÁRIO ──────────────────────────────────────────────────────────────────
export type TCargoUsuario = 'ADMIN' | 'COMERCIAL' | 'PRODUCAO' | 'FINANCEIRO' | 'VISUALIZADOR';

export interface IDbUsuario {
  id: string;
  empresa_id: string;
  nome: string;
  cargo: TCargoUsuario;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
export type IInsertUsuario = Omit<IDbUsuario, 'criado_em' | 'atualizado_em'>;
export type IUpdateUsuario = Partial<Omit<IInsertUsuario, 'id' | 'empresa_id'>>;

// ─── CLIENTE ──────────────────────────────────────────────────────────────────
export type TTipoPessoa = 'PF' | 'PJ';

export interface IDbCliente {
  id: string;
  empresa_id: string;
  nome: string;
  whatsapp: string | null;
  email: string | null;
  cpf_cnpj: string | null;
  tipo_pessoa: TTipoPessoa | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  origem: string | null;
  observacoes: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
export type IInsertCliente = Omit<IDbCliente, 'id' | 'empresa_id' | 'criado_em' | 'atualizado_em'>;
export type IUpdateCliente = Partial<IInsertCliente>;

// ─── CATEGORIA DE MATÉRIA PRIMA ───────────────────────────────────────────────
export interface IDbCategoriaMateriaPrima {
  id: string;
  empresa_id: string;
  nome: string;
  cor: string | null;
  criado_em: string;
}
export type IInsertCategoriaMateriaPrima = Omit<IDbCategoriaMateriaPrima, 'id' | 'empresa_id' | 'criado_em'>;
export type IUpdateCategoriaMateriaPrima = Partial<IInsertCategoriaMateriaPrima>;

// ─── MATÉRIA PRIMA ────────────────────────────────────────────────────────────
export type TUnidadeMedida = 'UN' | 'M2' | 'ML' | 'KG' | 'L' | 'ROLO';

export interface IDbMateriaPrima {
  id: string;
  empresa_id: string;
  categoria_id: string;
  nome: string;
  descricao: string | null;
  preco_unidade: number;
  qtde_estoque: number;
  unidade_medida: TUnidadeMedida;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
export type IInsertMateriaPrima = Omit<IDbMateriaPrima, 'id' | 'empresa_id' | 'criado_em' | 'atualizado_em'>;
export type IUpdateMateriaPrima = Partial<IInsertMateriaPrima>;

// ─── TEMPLATE ─────────────────────────────────────────────────────────────────
/**
 * Fórmulas de cálculo disponíveis para um template.
 * MULTIPLICA_TOTAL = aplica um multiplicador sobre o valor total do item (ex: adicional de instalação).
 */
export type TFormulaCalculo = 'UN' | 'M2' | 'ML' | 'QTDE' | 'MULTIPLICA_TOTAL';

export interface IDbTemplate {
  id: string;
  empresa_id: string;
  nome: string;
  formula_calculo: TFormulaCalculo;
  valor_base_venda: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
export type IInsertTemplate = Omit<IDbTemplate, 'id' | 'empresa_id' | 'criado_em' | 'atualizado_em'>;
export type IUpdateTemplate = Partial<IInsertTemplate>;

// ─── SEÇÃO DE TEMPLATE ────────────────────────────────────────────────────────
export interface IDbTemplateSecao {
  id: string;
  template_id: string;
  nome: string;
  ordem: number;
  criado_em: string;
}
export type IInsertTemplateSecao = Omit<IDbTemplateSecao, 'id' | 'criado_em'>;
export type IUpdateTemplateSecao = Partial<Omit<IInsertTemplateSecao, 'template_id'>>;

// ─── CAMPO DE TEMPLATE ────────────────────────────────────────────────────────
export type TTipoCalculo = 'UN' | 'M2' | 'ML' | 'QTDE' | 'MULTIPLICA_TOTAL';
export type TTipoEntrada = 'SELECAO_GRUPO' | 'ENTRADA_MANUAL' | 'SIM_NAO' | 'LISTA_OPCOES' | 'TEMPLATE';

export interface IDbTemplateCampo {
  id: string;
  secao_id: string;
  titulo: string;
  tipo_calculo: TTipoCalculo;
  tipo_entrada: TTipoEntrada;
  categoria_mp_id: string | null;
  template_ref_id: string | null;
  valor_venda_adicional: number | null;
  cond_campo_referencia: string | null;
  cond_valor_esperado: string | null;
  ordem: number;
  criado_em: string;
}
export type IInsertTemplateCampo = Omit<IDbTemplateCampo, 'id' | 'criado_em'>;
export type IUpdateTemplateCampo = Partial<Omit<IInsertTemplateCampo, 'secao_id'>>;

// ─── OPÇÃO DE CAMPO ───────────────────────────────────────────────────────────
export interface IDbTemplateCampoOpcao {
  id: string;
  campo_id: string;
  nome: string;
  valor_adicional: number;
  ordem: number;
  criado_em: string;
}
export type IInsertTemplateCampoOpcao = Omit<IDbTemplateCampoOpcao, 'id' | 'criado_em'>;
export type IUpdateTemplateCampoOpcao = Partial<Omit<IInsertTemplateCampoOpcao, 'campo_id'>>;

// ─── STATUS DE ORÇAMENTO ──────────────────────────────────────────────────────
export interface IDbStatusOrcamento {
  id: string;
  empresa_id: string;
  codigo: string;
  label: string;
  cor: string;
  ordem: number;
  criado_em: string;
}
export type IInsertStatusOrcamento = Omit<IDbStatusOrcamento, 'id' | 'empresa_id' | 'criado_em'>;
export type IUpdateStatusOrcamento = Partial<IInsertStatusOrcamento>;

// ─── TIPO DE FOLLOW-UP ────────────────────────────────────────────────────────
export interface IDbTipoFollowup {
  id: string;
  empresa_id: string;
  nome: string;
  descricao: string | null;
  criado_em: string;
}
export type IInsertTipoFollowup = Omit<IDbTipoFollowup, 'id' | 'empresa_id' | 'criado_em'>;
export type IUpdateTipoFollowup = Partial<IInsertTipoFollowup>;

// ─── ORÇAMENTO ────────────────────────────────────────────────────────────────
export interface IDbOrcamento {
  id: string;
  empresa_id: string;
  cliente_id: string | null;
  criado_por: string | null;
  numero_os: number;
  versao_os: string;
  status_codigo: string;
  arquivado: boolean;
  data_criacao: string;
  data_validade: string;
  data_entrega: string | null;
  valor_total: number;
  condicao_pagamento: string | null;
  prazo_pagamento: string | null;
  origem_cliente: string | null;
  tipo_followup_id: string | null;
  followup_realizado: boolean;
  criado_em: string;
  atualizado_em: string;
}
export type IInsertOrcamento = Omit<IDbOrcamento, 'id' | 'empresa_id' | 'numero_os' | 'criado_em' | 'atualizado_em'>;
export type IUpdateOrcamento = Partial<Omit<IInsertOrcamento, 'criado_por'>>;

// ─── ITEM DO ORÇAMENTO ────────────────────────────────────────────────────────
export interface IDbOrcamentoItem {
  id: string;
  orcamento_id: string;
  template_id: string | null;
  nome_template: string;
  sequencia: number;
  quantidade: number;
  largura: number | null;
  altura: number | null;
  descricao: string | null;
  observacao: string | null;
  respostas: Record<string, unknown>;
  anexos: string[];
  valor_total_item: number;
  criado_em: string;
}
export type IInsertOrcamentoItem = Omit<IDbOrcamentoItem, 'id' | 'criado_em'>;
export type IUpdateOrcamentoItem = Partial<Omit<IInsertOrcamentoItem, 'orcamento_id'>>;

// ─── SUBITEM DO ORÇAMENTO ─────────────────────────────────────────────────────
export interface IDbOrcamentoSubitem {
  id: string;
  item_id: string;
  template_id: string | null;
  nome: string;
  quantidade: number;
  largura: number | null;
  altura: number | null;
  respostas: Record<string, unknown>;
  valor_item: number;
  criado_em: string;
}
export type IInsertOrcamentoSubitem = Omit<IDbOrcamentoSubitem, 'id' | 'criado_em'>;
export type IUpdateOrcamentoSubitem = Partial<Omit<IInsertOrcamentoSubitem, 'item_id'>>;

// ─── FOLLOW-UP ────────────────────────────────────────────────────────────────
export interface IDbFollowup {
  id: string;
  orcamento_id: string;
  realizado_por: string | null;
  data_contato: string;
  tipo: string;
  observacao: string | null;
  criado_em: string;
}
export type IInsertFollowup = Omit<IDbFollowup, 'id' | 'criado_em'>;

// ─── HISTÓRICO DE STATUS ──────────────────────────────────────────────────────
export interface IDbOrcamentoHistoricoStatus {
  id: string;
  orcamento_id: string;
  alterado_por: string | null;
  status_anterior: string | null;
  status_novo: string;
  observacao: string | null;
  alterado_em: string;
}
export type IInsertOrcamentoHistoricoStatus = Omit<IDbOrcamentoHistoricoStatus, 'id' | 'alterado_em'>;

// ─── CONFIGURAÇÕES DA EMPRESA ─────────────────────────────────────────────────
export interface IDbConfiguracaoEmpresa {
  id: string;
  empresa_id: string;
  chave: string;
  valor: string;
  mes_ref: string | null;
  criado_em: string;
  atualizado_em: string;
}
export type IInsertConfiguracaoEmpresa = Omit<IDbConfiguracaoEmpresa, 'id' | 'empresa_id' | 'criado_em' | 'atualizado_em'>;
export type IUpdateConfiguracaoEmpresa = Pick<IDbConfiguracaoEmpresa, 'valor'>;

// ─── TIPOS COMPOSTOS (com joins) ──────────────────────────────────────────────
export interface IDbTemplateCompleto extends IDbTemplate {
  secoes: Array<IDbTemplateSecao & {
    campos: Array<IDbTemplateCampo & {
      opcoes_lista: IDbTemplateCampoOpcao[];
    }>;
  }>;
  addons: string[];
}

export interface IDbOrcamentoCompleto extends IDbOrcamento {
  cliente: Pick<IDbCliente, 'id' | 'nome' | 'whatsapp' | 'email'> | null;
  itens: Array<IDbOrcamentoItem & { subitens: IDbOrcamentoSubitem[] }>;
  followups: IDbFollowup[];
}
