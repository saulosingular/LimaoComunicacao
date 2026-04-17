export interface IFollowupDTO {
  id: string;
  data: string; // ISO String ou YYYY-MM-DD
  tipo: string;
  observacao: string;
}

export interface IOrcamentoSubItemDTO {
  id: string;
  templateId: string;
  nome: string;
  valorItem: number;
  respostas: Record<string, any>;
  quantidade: number;
  largura: number;
  altura: number;
  descricao?: string; // Descrição opcional para identificar ou detalhar este Addon especificamente
}

export interface IOrcamentoItemDTO {
  id: string; // ID do Item no Orcamento
  templateId: string;
  nome: string; // Nome do Template na hora da venda
  quantidade: number;
  largura?: number; // Se M2 ou ML
  altura?: number; // Se M2
  respostas: Record<string, any>; // { [campoId]: valorSelecionadoOuDigitado }
  sequencia?: number; // Ordenação na OS
  descricao?: string; // Detalhamento rico do serviço
  observacao?: string; // Notas internas / cliente
  anexos?: string[]; // Array de URLs ou Base64 representativas 
  subItens?: IOrcamentoSubItemDTO[];
  valorTotalItem: number;
}

export interface IOrcamentoDTO {
  id: string;
  numeroOs?: number;
  versaoOs?: string;
  arquivado?: boolean;
  clienteId?: string;     // FK para tabela clientes
  cliente: string;        // nome do cliente (display)
  whatsapp?: string;
  dataCriacao: string; // ISO String
  dataValidade: string; // ISO String
  itens: IOrcamentoItemDTO[];
  valorTotalOrcamento: number;
  status: string;

  // Comercial & Logística
  dataEntrega?: string; 
  condicaoPagamento?: string;
  prazoPagamento?: string;
  origemCliente?: string;

  // Follow-up API
  tipoFollowupId?: string; // ID da Cadência escolhida
  followups?: IFollowupDTO[];
  followupRealizado?: boolean;
}
