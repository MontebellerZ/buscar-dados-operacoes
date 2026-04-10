export type TOperacaoAutomacao = {
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
};
