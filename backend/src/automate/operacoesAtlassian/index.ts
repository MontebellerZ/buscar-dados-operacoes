import processarIssues from "./functions/processarIssues";
import Api from "./api";
import ordenarIssues from "./functions/ordenarIssues";

async function operacoesAtlassian() {
  console.info("Iniciando execução da automação.");

  const chaves = await Api.BuscarListaIssues();

  const itens = await processarIssues(chaves);

  ordenarIssues(itens);

  console.info("Automação finalizada com sucesso.");

  return itens;
}

export default operacoesAtlassian;
