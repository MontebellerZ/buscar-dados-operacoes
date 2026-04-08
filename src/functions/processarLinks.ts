import { Browser } from "puppeteer";
import { ItemTabela } from "../types";
import envData from "../data/envData";
import obterDadosExpandido from "./obterDadosExpandido";
import selectors from "../data/selectors";
import criarBrowserContext from "./criarBrowserContext";

async function processarLinks(browser: Browser, baseUrl: string, itens: ItemTabela[]) {
  const { workers } = envData;

  const cookiesSessao = await browser.cookies();

  const totalWorkers = Math.max(1, Math.min(workers, itens.length || 1));
  let proximoIndex = 0;

  const worker = async () => {
    const { context, page } = await criarBrowserContext(browser, cookiesSessao);

    try {
      while (proximoIndex < itens.length) {
        const item = itens[proximoIndex];
        proximoIndex++;

        const destino = new URL(item.link, baseUrl).toString();

        try {
          await page.goto(destino, { waitUntil: "networkidle2", timeout: 60000 });
          await page.waitForSelector(selectors.botaoExpandir, { timeout: 30000 });
          await page.click(selectors.botaoExpandir);

          const dadosExpandido = await obterDadosExpandido(page);
          Object.assign(item, dadosExpandido);
        } catch (error) {
          console.error(`Falha ao processar item ${item.id} (${destino})`, error);
        }
      }
    } finally {
      await page.close();
      await context.close();
    }
  };

  await Promise.all(Array.from({ length: totalWorkers }, () => worker()));
}

export default processarLinks;
