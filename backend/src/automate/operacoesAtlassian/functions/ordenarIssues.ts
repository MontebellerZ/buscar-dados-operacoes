import { Operacao } from "../../../types/operacao.type";

function ordenarIssues(itens: Operacao[]) {
  console.info("Ordenando as issues por data.");
  
  itens.sort((a, b) => (b.date?.valueOf() ?? 0) - (a.date?.valueOf() ?? 0));
}

export default ordenarIssues;
