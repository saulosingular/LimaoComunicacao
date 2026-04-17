import type {
  IDbOrcamento,
  IDbOrcamentoCompleto,
  IDbOrcamentoItem,
  IDbOrcamentoSubitem,
  IDbFollowup,
  IDbStatusOrcamento,
  IDbTipoFollowup,
  IInsertOrcamento,
  IInsertOrcamentoItem,
  IInsertOrcamentoSubitem,
} from '@/shared/interfaces/supabase';
import type {
  IOrcamentoDTO,
  IOrcamentoItemDTO,
  IOrcamentoSubItemDTO,
  IFollowupDTO,
} from '@/shared/interfaces/orcamento';
import type { IOrcamentoStatusOption, ITipoFollowup } from '@/hooks/useOrcamento';

// ─── Tipo bruto retornado pelo orcamentoService.listar() ─────────────────────
export interface IDbOrcamentoListagemRow {
  id: string;
  numero_os: number;
  versao_os: string;
  status_codigo: string;
  arquivado: boolean;
  data_criacao: string;
  data_validade: string;
  data_entrega: string | null;
  valor_total: number;
  followup_realizado: boolean;
  cliente: { id: string; nome: string; whatsapp: string | null } | { id: string; nome: string; whatsapp: string | null }[] | null;
}

// ─── Sub-item DB → DTO ──────────────────────────────────────────────────────
function dbToSubItemDTO(db: IDbOrcamentoSubitem): IOrcamentoSubItemDTO {
  return {
    id: db.id,
    templateId: db.template_id || '',
    nome: db.nome,
    valorItem: db.valor_item,
    respostas: db.respostas as Record<string, unknown>,
    quantidade: db.quantidade,
    largura: db.largura || 0,
    altura: db.altura || 0,
    descricao: (db.respostas as any)?.__descricao_interna || undefined,
  };
}

// ─── Item DB → DTO ──────────────────────────────────────────────────────────
function dbToItemDTO(db: IDbOrcamentoItem & { subitens?: IDbOrcamentoSubitem[] }): IOrcamentoItemDTO {
  return {
    id: db.id,
    templateId: db.template_id || '',
    nome: db.nome_template,
    quantidade: db.quantidade,
    largura: db.largura ?? undefined,
    altura: db.altura ?? undefined,
    respostas: db.respostas as Record<string, unknown>,
    sequencia: db.sequencia,
    descricao: db.descricao ?? undefined,
    observacao: db.observacao ?? undefined,
    anexos: db.anexos || [],
    subItens: (db.subitens || []).map(dbToSubItemDTO),
    valorTotalItem: db.valor_total_item,
  };
}

// ─── Follow-up DB → DTO ────────────────────────────────────────────────────
function dbToFollowupDTO(db: IDbFollowup): IFollowupDTO {
  return {
    id: db.id,
    data: db.data_contato,
    tipo: db.tipo,
    observacao: db.observacao || '',
  };
}

// ─── Orçamento Completo DB → DTO ────────────────────────────────────────────
export function dbToOrcamentoDTO(db: IDbOrcamentoCompleto): IOrcamentoDTO {
  return {
    id: db.id,
    numeroOs: db.numero_os,
    versaoOs: db.versao_os,
    arquivado: db.arquivado,
    clienteId: db.cliente_id ?? undefined,
    cliente: db.cliente?.nome || '',
    whatsapp: db.cliente?.whatsapp ?? undefined,
    dataCriacao: db.data_criacao,
    dataValidade: db.data_validade,
    itens: (db.itens || []).map(dbToItemDTO),
    valorTotalOrcamento: db.valor_total,
    status: db.status_codigo,
    dataEntrega: db.data_entrega ?? undefined,
    condicaoPagamento: db.condicao_pagamento ?? undefined,
    prazoPagamento: db.prazo_pagamento ?? undefined,
    origemCliente: db.origem_cliente ?? undefined,
    tipoFollowupId: db.tipo_followup_id ?? undefined,
    followups: (db.followups || []).map(dbToFollowupDTO),
    followupRealizado: db.followup_realizado,
  };
}

// ─── Orçamento Listagem Row → DTO (versão enxuta para tabelas) ──────────────
export function dbListagemToOrcamentoDTO(db: IDbOrcamentoListagemRow): IOrcamentoDTO {
  // Supabase pode retornar o join como objeto ou array — normaliza
  const cli = Array.isArray(db.cliente) ? db.cliente[0] : db.cliente;
  return {
    id: db.id,
    numeroOs: db.numero_os,
    versaoOs: db.versao_os,
    arquivado: db.arquivado,
    clienteId: cli?.id ?? undefined,
    cliente: cli?.nome || '',
    whatsapp: cli?.whatsapp ?? undefined,
    dataCriacao: db.data_criacao,
    dataValidade: db.data_validade,
    itens: [],
    valorTotalOrcamento: db.valor_total,
    status: db.status_codigo,
    dataEntrega: db.data_entrega ?? undefined,
    followupRealizado: db.followup_realizado,
  };
}

// ─── DTO → INSERT Orçamento ─────────────────────────────────────────────────
export function dtoToInsertOrcamento(dto: Omit<IOrcamentoDTO, 'id' | 'numeroOs' | 'versaoOs'>): IInsertOrcamento {
  return {
    cliente_id: dto.clienteId || null,
    criado_por: null, // preenchido pelo backend/hook
    versao_os: 'A',
    status_codigo: dto.status || 'RASCUNHO',
    arquivado: false,
    data_criacao: dto.dataCriacao || new Date().toISOString().split('T')[0],
    data_validade: dto.dataValidade,
    data_entrega: dto.dataEntrega || null,
    valor_total: dto.valorTotalOrcamento,
    condicao_pagamento: dto.condicaoPagamento || null,
    prazo_pagamento: dto.prazoPagamento || null,
    origem_cliente: dto.origemCliente || null,
    tipo_followup_id: dto.tipoFollowupId || null,
    followup_realizado: dto.followupRealizado || false,
  };
}

// ─── DTO → INSERT Item ──────────────────────────────────────────────────────
export function dtoToInsertItem(orcamentoId: string, dto: IOrcamentoItemDTO): IInsertOrcamentoItem {
  return {
    orcamento_id: orcamentoId,
    template_id: dto.templateId || null,
    nome_template: dto.nome,
    sequencia: dto.sequencia || 0,
    quantidade: dto.quantidade,
    largura: dto.largura || null,
    altura: dto.altura || null,
    descricao: dto.descricao || null,
    observacao: dto.observacao || null,
    respostas: dto.respostas || {},
    anexos: dto.anexos || [],
    valor_total_item: dto.valorTotalItem,
  };
}

// ─── DTO → INSERT Subitem ───────────────────────────────────────────────────
export function dtoToInsertSubitem(itemId: string, dto: IOrcamentoSubItemDTO): IInsertOrcamentoSubitem {
  return {
    item_id: itemId,
    template_id: dto.templateId || null,
    nome: dto.nome,
    quantidade: dto.quantidade,
    largura: dto.largura || null,
    altura: dto.altura || null,
    respostas: { ...(dto.respostas || {}), __descricao_interna: dto.descricao },
    valor_item: dto.valorItem,
  };
}

// ─── Status DB → DTO ────────────────────────────────────────────────────────
export function dbToStatusOption(db: IDbStatusOrcamento): IOrcamentoStatusOption {
  return {
    id: db.codigo,
    label: db.label,
    color: db.cor,
    order: db.ordem,
  };
}

// ─── Tipo Follow-up DB → DTO ────────────────────────────────────────────────
export function dbToTipoFollowup(db: IDbTipoFollowup): ITipoFollowup {
  return {
    id: db.id,
    nome: db.nome,
    descricao: db.descricao ?? undefined,
  };
}
