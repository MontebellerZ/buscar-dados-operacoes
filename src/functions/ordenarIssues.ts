import { ItemTabela } from "../types";

function ordenarIssues(itens: ItemTabela[]) {
  console.info("Ordenando as issues por data.");
  
  itens.sort((a, b) => (b.date?.valueOf() ?? 0) - (a.date?.valueOf() ?? 0));
}

export default ordenarIssues;
