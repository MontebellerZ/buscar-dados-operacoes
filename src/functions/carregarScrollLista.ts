import { Page } from "puppeteer";
import sleep from "./sleep";

async function carregarScrollLista(page: Page): Promise<void> {
  const maxTentativas = 120;
  const tentativasEstaveisNecessarias = 4;
  let tentativasEstaveis = 0;
  let assinaturaAnterior = "";

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    const metricas = await page.evaluate(() => {
      const scrollables = Array.from(document.querySelectorAll<HTMLElement>("*")).filter(
        (elemento) => elemento.scrollHeight - elemento.clientHeight > 4,
      );

      let somaAlturasScroll = 0;

      for (const elemento of scrollables) {
        somaAlturasScroll += elemento.scrollHeight;
        elemento.scrollTo({ top: elemento.scrollHeight, behavior: "auto" });
      }

      window.scrollTo({
        top: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        behavior: "auto",
      });

      const alturaDocumento = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      const totalLinhasTabela = document.querySelectorAll("table tr").length;

      return {
        alturaDocumento,
        somaAlturasScroll,
        totalLinhasTabela,
      };
    });

    await Promise.race([
      page.waitForNetworkIdle({ idleTime: 1200, timeout: 7000 }),
      sleep(2500),
    ]).catch(() => undefined);

    const assinaturaAtual = `${metricas.alturaDocumento}-${metricas.somaAlturasScroll}-${metricas.totalLinhasTabela}`;

    if (assinaturaAtual === assinaturaAnterior) {
      tentativasEstaveis += 1;
    } else {
      tentativasEstaveis = 0;
      assinaturaAnterior = assinaturaAtual;
    }

    if (tentativasEstaveis >= tentativasEstaveisNecessarias) {
      return;
    }
  }
}

export default carregarScrollLista;
