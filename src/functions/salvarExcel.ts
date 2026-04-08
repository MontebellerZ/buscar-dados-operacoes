import { ItemTabela } from "../types";
import XLSX from "xlsx";

function salvarExcel(itens: ItemTabela[]): void {
  const linhas: string[][] = [
    [
      "Id",
      "Nome do Cliente",
      "Nome do Motorista",
      "CPF do Motorista",
      "Origem e Destino",
      "Placas",
      "Observações",
    ],
  ];

  for (const item of itens) {
    linhas.push([
      item.id,
      item.nomeCliente,
      item.nomeMotorista,
      item.cpfMotorista,
      item.origemDestino,
      item.placas,
      item.observacoes,
    ]);
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(linhas);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Operacoes");
  XLSX.writeFile(workbook, "dados-operacoes.xlsx");
}

export default salvarExcel;
