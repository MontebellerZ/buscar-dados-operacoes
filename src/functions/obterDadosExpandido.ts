import { Page } from "puppeteer";
import selectors from "../data/selectors";

async function obterDadosExpandido(page: Page) {
  await page.waitForSelector(selectors.nomeCliente, { timeout: 15000 }).catch(() => undefined);

  return page.evaluate((selectors) => {
    const texto = (selector: string): string => {
      const elemento = document.querySelector<HTMLElement>(selector);
      return (elemento?.textContent || "").trim();
    };

    return {
      nomeCliente: texto(selectors.nomeCliente),
      nomeMotorista: texto(selectors.nomeMotorista),
      cpfMotorista: texto(selectors.cpfMotorista),
      origemDestino: texto(selectors.origemDestino),
      placas: texto(selectors.placas),
      observacoes: texto(selectors.observacoes),
    };
  }, selectors);
}

export default obterDadosExpandido;
