import envData from "../../../config/envData";
import { TOperacaoAutomacao } from "../../../types/operacaoAutomacao.type";
import XLSX from "xlsx";

function salvarExcel(itens: TOperacaoAutomacao[], outputPath?: string): void {
  console.info("Gerando conteúdo da planilha");

  const linhas: string[][] = [
    [
      "Chave",
      "Data e Hora",
      "Nome do Cliente",
      "Nome do Motorista",
      "CPF do Motorista",
      "Origem e Destino",
      "Placas",
      "NF",
      "Pedido",
      "Qtde/Plts",
      "Frete Líquido / MP PREFORMA",
    ],
  ];

  for (const item of itens) {
    linhas.push([
      item.key,
      item.date?.toLocaleString() ?? "",
      item.nomeCliente ?? "",
      item.nomeMotorista ?? "",
      item.cpfMotorista ?? "",
      item.origemDestino ?? "",
      item.placas ?? "",
      item.nf ?? "",
      item.pedido ?? "",
      item.qtdePlts ?? "",
      item.freteLiquido?.toString() ?? "",
    ]);
  }

  console.info("Criando nova planilha.");

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(linhas);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Operacoes");
  XLSX.writeFile(workbook, outputPath || envData.outputPath);

  console.info("Planilha salva com sucesso.");
}

export default salvarExcel;
