import salvarExcel from "./functions/salvarExcel";
import obterLinksDaTabela from "./functions/obterLinksDaTabela";
import carregarScrollLista from "./functions/carregarScrollLista";
import logar from "./functions/logar";
import processarLinks from "./functions/processarLinks";
import criarJanela from "./functions/criarJanela";

async function main() {
  const { browser, page } = await criarJanela();

  try {
    await logar(page);

    await carregarScrollLista(page);

    const itensTabela = await obterLinksDaTabela(page);

    await processarLinks(browser, page.url(), itensTabela);

    salvarExcel(itensTabela);
  } finally {
    await browser.close();
  }
}

main().catch((error) => console.error("Falha na automacao:", error));
