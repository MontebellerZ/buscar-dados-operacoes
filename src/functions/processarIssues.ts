import { ItemTabela } from "../types";
import envData from "../config/envData";
import Api from "../api";
import atribuirDadosExpandidos from "./atribuirDadosExpandidos";
import atribuirDadosIssue from "./atribuirDadosIssue";

async function processarIssues(itens: ItemTabela[]) {
  const { workers } = envData;

  const totalWorkers = Math.max(1, Math.min(workers, itens.length || 1));
  let indexAtual = 0;
  let completas = 0;
  let erro: any;

  console.info(
    `Total de issues a serem processadas: ${itens.length}.\nTotal de workers para a execução: ${totalWorkers}.`,
  );

  const worker = async (id: number) => {
    while (!erro && indexAtual < itens.length) {
      const item = itens[indexAtual];
      indexAtual++;

      try {
        const dadosIssue = await Api.BuscarIssueId(item.key);

        atribuirDadosIssue(item, dadosIssue);

        const dadosExpandidos = await Api.BuscarDadosExpandidos(item.id);

        atribuirDadosExpandidos(item, dadosExpandidos);

        completas++;
        console.info(
          `Processado ${item.key} (${completas} de ${itens.length}) // worker ${id}`,
        );
      } catch (err) {
        erro = err;
        console.error(item.key, err);
        throw err;
      }
    }
  };

  console.info("Iniciando processamento de issues.");

  await Promise.all(Array.from({ length: totalWorkers }, (_, i) => worker(i)));

  console.info(`Processamento de issues completo: ${completas} rastreadas.`);
}

export default processarIssues;
