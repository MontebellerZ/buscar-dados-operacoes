export type TOperacao = {
  id: number;
  key: string;
  issueId: number;
  date: Date;
  nomeCliente: string;
  nomeMotorista: string;
  cpfMotorista: string;
  origemDestino: string;
  placas: string;
  nf?: string;
  pedido?: string;
  qtdePlts?: string;
  freteLiquido?: number;
  taxaMotorista?: number;
  lucro?: number;
  validado: number;
  ativo: number;
};

export type TOperacaoPaginada = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: TOperacao[];
};
