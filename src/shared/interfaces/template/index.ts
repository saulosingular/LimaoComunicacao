import type { TFormulaCalculo, TTipoCalculo, TTipoEntrada } from '@/shared/interfaces/supabase';

// Re-exporta os tipos do banco para uso no front — mantém sincronismo com o schema do Supabase
export type TipoCalculoCampo = TTipoCalculo;   // 'UN' | 'M2' | 'ML' | 'QTDE' | 'MULTIPLICA_TOTAL'
export type TipoEntradaCampo = TTipoEntrada;   // 'SELECAO_GRUPO' | 'ENTRADA_MANUAL' | 'SIM_NAO' | 'LISTA_OPCOES' | 'TEMPLATE'

export interface IOpcaoCampoDTO {
  id: string;
  nome: string;
  /** Valor em R$ adicionado ao custo do item quando esta opção for selecionada. */
  valorAdicional: number;
}

export interface ICondicaoVisibilidade {
  /** Título do campo de referência — deve corresponder exatamente ao "titulo" do campo que controla a visibilidade. */
  campoReferencia: string;
  /** Valor que o campo de referência deve ter para que este campo seja exibido. */
  valorEsperado: string;
}

export interface ITemplateCampoDTO {
  id: string;
  titulo: string;
  tipoCalculo: TipoCalculoCampo;
  tipoEntrada: TipoEntradaCampo;
  /**
   * ID (UUID) da categoria de matéria prima — FK para a tabela "categorias_materia_prima".
   * Obrigatório quando tipoEntrada === 'SELECAO_GRUPO'.
   */
  categoriaMateriaPrima?: string;
  /**
   * ID (UUID) do template vinculado como sub-template.
   * Obrigatório quando tipoEntrada === 'TEMPLATE'.
   */
  templateId?: string;
  /** Valor em R$ adicionado ao total do item quando este campo for preenchido. */
  valorVendaAdicional?: number;
  /** Lista de opções disponíveis para seleção. Obrigatório quando tipoEntrada === 'LISTA_OPCOES'. */
  opcoesLista?: IOpcaoCampoDTO[];
  /** Regra opcional de visibilidade condicional para este campo. */
  condicaoVisibilidade?: ICondicaoVisibilidade;
}

export interface ITemplateSecaoDTO {
  id: string;
  nome: string;
  campos: ITemplateCampoDTO[];
}

export interface ITemplateDTO {
  id: string;
  nome: string;
  /** Fórmula de cálculo do valor base: 'M2', 'ML', 'UN', 'QTDE' ou 'MULTIPLICA_TOTAL'. */
  formulaCalculo: TFormulaCalculo;
  valorBaseVenda: number;
  secoes: ITemplateSecaoDTO[];
  /** IDs (UUIDs) dos templates que funcionam como add-ons/complementos deste template. */
  addons: string[];
}
