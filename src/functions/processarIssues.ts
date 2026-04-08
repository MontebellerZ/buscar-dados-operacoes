import { ItemTabela } from "../types";
import envData from "../config/envData";
import Api from "../api";

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
        item.id = await Api.BuscarIssueId(item.key);

        const dados = await Api.BuscarDadosExpandidos(item.id);

        item.nomeCliente = dados.customfield_10107.value.text;
        item.nomeMotorista = dados.customfield_11769.value.text;
        item.cpfMotorista = dados.customfield_12209.value.text;
        item.origemDestino = dados.customfield_12186.value.text;
        item.placas = dados.customfield_11590.value.text;
        item.observacoes = dados.customfield_12222.value.adf.content
          .flatMap((f) => f.content?.map((f) => f.text).filter(Boolean))
          .join(" | ");

        completas++;
        console.info(
          `Issue processada ${item.key} (${completas} de ${itens.length}) // worker ${id}`,
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
