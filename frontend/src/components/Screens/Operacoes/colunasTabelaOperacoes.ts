import type { TOperacao } from "../../../types/operacao.type";
import { formatCurrency, formatDateTime, formatText } from "../../../utils/formatters";
import type { TabelaGerenciadaColuna } from "../../Shared/TabelaGerenciada";

const colunasTabelaOperacoes: TabelaGerenciadaColuna<TOperacao>[] = [
  {
    key: "key",
    label: "Key",
    render: (row) => formatText(row.key),
    default: true,
  },
  {
    key: "date",
    label: "Data",
    render: (row) => formatDateTime(row.date),
    default: true,
  },
  {
    key: "nomeCliente",
    label: "Cliente",
    render: (row) => formatText(row.nomeCliente),
    default: true,
  },
  {
    key: "nomeMotorista",
    label: "Motorista",
    render: (row) => formatText(row.nomeMotorista),
    default: true,
  },
  {
    key: "cpfMotorista",
    label: "CPF Motorista",
    render: (row) => formatText(row.cpfMotorista),
  },
  {
    key: "origemDestino",
    label: "Origem/Destino",
    render: (row) => formatText(row.origemDestino),
    default: true,
  },
  {
    key: "placas",
    label: "Placas",
    render: (row) => formatText(row.placas),
  },
  {
    key: "nf",
    label: "NF",
    render: (row) => formatText(row.nf),
  },
  {
    key: "pedido",
    label: "Pedido",
    render: (row) => formatText(row.pedido),
  },
  {
    key: "qtdePlts",
    label: "Qtde PLTs",
    render: (row) => formatText(row.qtdePlts),
  },
  {
    key: "freteLiquido",
    label: "Frete Líquido",
    render: (row) => formatCurrency(row.freteLiquido),
  },
  {
    key: "taxaMotorista",
    label: "Taxa Motorista",
    render: (row) => formatCurrency(row.taxaMotorista),
  },
  {
    key: "lucro",
    label: "Lucro",
    render: (row) => formatCurrency(row.lucro),
    default: true,
  },
  {
    key: "validado",
    label: "Validado",
    render: (row) => (row.validado ? "Sim" : "Não"),
  },
];

export default colunasTabelaOperacoes;
