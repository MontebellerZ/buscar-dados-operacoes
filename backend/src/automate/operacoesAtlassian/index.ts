import salvarExcel from "./functions/salvarExcel";
import processarIssues from "./functions/processarIssues";
import Api from "./api";
import ordenarIssues from "./functions/ordenarIssues";

interface IOperacoesAtlassian {
  gerarExcel?: boolean;
  excelOutputPath?: string;
}

async function operacoesAtlassian(props?: IOperacoesAtlassian) {
  console.info("Iniciando execução da automação.");

  const itens = await Api.BuscarListaIssues();

  await processarIssues(itens);

  ordenarIssues(itens);

  if (props?.gerarExcel) salvarExcel(itens, props.excelOutputPath);

  console.info("Automação finalizada com sucesso.");

  return itens;
}

export default operacoesAtlassian;
