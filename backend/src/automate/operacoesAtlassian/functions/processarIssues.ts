import { TOperacaoAutomacao } from "../../../types/operacaoAutomacao.type";
import envData from "../../../config/envData";
import Api from "../api";
import converterDadosExpandidos from "./converterDadosExpandidos";
import converterDadosIssue from "./converterDadosIssue";

async function processarIssues(chaves: string[]) {
  const { workers } = envData;

  const totalChaves = chaves.length;
  const totalWorkers = Math.max(1, Math.min(workers, totalChaves || 1));

  const operacoes: TOperacaoAutomacao[] = [];
  let erro: any;

  console.info(`Total de issues a serem processadas: ${totalChaves}.`);
  console.info(`Total de workers para a execução: ${totalWorkers}.`);

  const worker = async (id: number) => {
    while (!erro && chaves.length) {
      const chave = chaves.shift()!;

      try {
        const dadosIssue = await Api.BuscarIssueId(chave);

        const issue = converterDadosIssue(dadosIssue);

        const dadosExpandidos = await Api.BuscarDadosExpandidos(issue.issueId);

        const expandido = converterDadosExpandidos(dadosExpandidos);

        const operacao: TOperacaoAutomacao = { key: chave, ...issue, ...expandido };

        operacoes.push(operacao);

        console.info(`Processado ${chave} (${operacoes.length} de ${totalChaves}) // worker ${id}`);
      } catch (err) {
        erro = err;
        console.error(chave, err);
        throw err;
      }
    }
  };

  console.info("Iniciando processamento de issues.");

  await Promise.all(Array.from({ length: totalWorkers }, (_, i) => worker(i + 1)));

  console.info(`Processamento de issues completo: ${operacoes.length} rastreadas.`);

  return operacoes;
}

export default processarIssues;
