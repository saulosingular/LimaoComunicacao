import type {
  IDbTemplateCompleto,
  IDbTemplate,
  IDbTemplateSecao,
  IDbTemplateCampo,
  IDbTemplateCampoOpcao,
  IInsertTemplate,
  IInsertTemplateSecao,
  IInsertTemplateCampo,
  IInsertTemplateCampoOpcao,
} from '@/shared/interfaces/supabase';
import type {
  ITemplateDTO,
  ITemplateSecaoDTO,
  ITemplateCampoDTO,
  IOpcaoCampoDTO,
} from '@/shared/interfaces/template';

// ─── Tipo bruto retornado pelo Supabase (antes do cast para IDbTemplateCompleto) ─
type RawTemplateAddons = { addon_id: string }[];

interface IDbTemplateRaw extends IDbTemplate {
  secoes?: Array<IDbTemplateSecao & {
    campos?: Array<IDbTemplateCampo & {
      opcoes_lista?: IDbTemplateCampoOpcao[];
    }>;
  }>;
  template_addons?: RawTemplateAddons;
  addons?: string[];
}

// ─── Opção DB → DTO ──────────────────────────────────────────────────────────
function dbToOpcaoDTO(db: IDbTemplateCampoOpcao): IOpcaoCampoDTO {
  return {
    id: db.id,
    nome: db.nome,
    valorAdicional: db.valor_adicional,
  };
}

// ─── Campo DB → DTO ──────────────────────────────────────────────────────────
function dbToCampoDTO(db: IDbTemplateCampo & { opcoes_lista?: IDbTemplateCampoOpcao[] }): ITemplateCampoDTO {
  const campo: ITemplateCampoDTO = {
    id: db.id,
    titulo: db.titulo,
    tipoCalculo: db.tipo_calculo,
    tipoEntrada: db.tipo_entrada,
  };

  if (db.categoria_mp_id) campo.categoriaMateriaPrima = db.categoria_mp_id;
  if (db.template_ref_id) campo.templateId = db.template_ref_id;
  if (db.valor_venda_adicional != null) campo.valorVendaAdicional = db.valor_venda_adicional;
  if (db.opcoes_lista?.length) campo.opcoesLista = db.opcoes_lista.map(dbToOpcaoDTO);
  if (db.cond_campo_referencia) {
    campo.condicaoVisibilidade = {
      campoReferencia: db.cond_campo_referencia,
      valorEsperado: db.cond_valor_esperado || '',
    };
  }

  return campo;
}

// ─── Seção DB → DTO ──────────────────────────────────────────────────────────
function dbToSecaoDTO(
  db: IDbTemplateSecao & { campos?: Array<IDbTemplateCampo & { opcoes_lista?: IDbTemplateCampoOpcao[] }> },
): ITemplateSecaoDTO {
  return {
    id: db.id,
    nome: db.nome,
    campos: (db.campos || [])
      .sort((a, b) => a.ordem - b.ordem)
      .map(dbToCampoDTO),
  };
}

// ─── Template Completo DB → DTO ──────────────────────────────────────────────
export function dbToTemplateDTO(db: IDbTemplateRaw): ITemplateDTO {
  // addons pode vir como array de strings (IDbTemplateCompleto) ou como template_addons raw
  let addons: string[] = [];
  if (db.addons && Array.isArray(db.addons)) {
    addons = db.addons;
  } else if (db.template_addons && Array.isArray(db.template_addons)) {
    addons = db.template_addons.map(a => a.addon_id);
  }

  return {
    id: db.id,
    nome: db.nome,
    formulaCalculo: db.formula_calculo,
    valorBaseVenda: db.valor_base_venda,
    secoes: (db.secoes || [])
      .sort((a, b) => a.ordem - b.ordem)
      .map(dbToSecaoDTO),
    addons,
  };
}

// ─── Template DTO → INSERT ───────────────────────────────────────────────────
export function dtoToInsertTemplate(dto: Omit<ITemplateDTO, 'id' | 'secoes' | 'addons'>): IInsertTemplate {
  return {
    nome: dto.nome,
    formula_calculo: dto.formulaCalculo as IInsertTemplate['formula_calculo'],
    valor_base_venda: dto.valorBaseVenda,
    ativo: true,
  };
}

export function dtoToInsertSecao(templateId: string, dto: Omit<ITemplateSecaoDTO, 'id' | 'campos'>, ordem: number): IInsertTemplateSecao {
  return {
    template_id: templateId,
    nome: dto.nome,
    ordem,
  };
}

export function dtoToInsertCampo(secaoId: string, dto: Omit<ITemplateCampoDTO, 'id' | 'opcoesLista'>, ordem: number): IInsertTemplateCampo {
  return {
    secao_id: secaoId,
    titulo: dto.titulo,
    tipo_calculo: dto.tipoCalculo,
    tipo_entrada: dto.tipoEntrada,
    categoria_mp_id: dto.categoriaMateriaPrima || null,
    template_ref_id: dto.templateId || null,
    valor_venda_adicional: dto.valorVendaAdicional ?? null,
    cond_campo_referencia: dto.condicaoVisibilidade?.campoReferencia || null,
    cond_valor_esperado: dto.condicaoVisibilidade?.valorEsperado || null,
    ordem,
  };
}

export function dtoToInsertOpcao(campoId: string, dto: Omit<IOpcaoCampoDTO, 'id'>, ordem: number): IInsertTemplateCampoOpcao {
  return {
    campo_id: campoId,
    nome: dto.nome,
    valor_adicional: dto.valorAdicional,
    ordem,
  };
}
