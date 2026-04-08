import salvarExcel from "./functions/salvarExcel";
import logar from "./functions/logar";
import processarIssues from "./functions/processarIssues";
import Api from "./api";

async function main() {
  console.info("Iniciando execução da automação.");

  await logar();

  const itens = await Api.BuscarListaIssues();

  await processarIssues(itens);

  salvarExcel(itens);

  console.info("Automação finalizada com sucesso.");
}

main().catch((error) => console.error("Falha na automação:", error));
