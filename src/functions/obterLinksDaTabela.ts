import { Page } from "puppeteer";
import { ItemTabela } from "../types";
import selectors from "../data/selectors";

async function obterLinksDaTabela(page: Page): Promise<ItemTabela[]> {
  return page.evaluate((selectors) => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>(selectors.linksTabela));

    return anchors
      .map(
        (anchor): ItemTabela => ({
          id: (anchor.textContent || "").trim(),
          link: (anchor.getAttribute("href") || "").trim(),
          nomeCliente: "",
          nomeMotorista: "",
          cpfMotorista: "",
          origemDestino: "",
          placas: "",
          observacoes: "",
        }),
      )
      .filter((item) => item.id.length > 0 && item.link.length > 0);
  }, selectors);
}

export default obterLinksDaTabela;
