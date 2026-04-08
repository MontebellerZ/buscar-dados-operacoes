import puppeteer, { Page } from "puppeteer";
import * as XLSX from "xlsx";
import "dotenv/config";

type ItemTabela = {
  id: string;
  link: string;
  nomeCliente: string;
  nomeMotorista: string;
  cpfMotorista: string;
  origemDestino: string;
  placas: string;
  observacoes: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function salvarExcel(itens: ItemTabela[]): void {
  const linhas: string[][] = [
    [
      "Id",
      "Nome do Cliente",
      "Nome do Motorista",
      "CPF do Motorista",
      "Origem e Destino",
      "Placas",
      "Observações",
    ],
  ];

  for (const item of itens) {
    linhas.push([
      item.id,
      item.nomeCliente,
      item.nomeMotorista,
      item.cpfMotorista,
      item.origemDestino,
      item.placas,
      item.observacoes,
    ]);
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(linhas);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Operacoes");
  XLSX.writeFile(workbook, "dados-operacoes.xlsx");
}

async function obterLinksDaTabela(page: Page): Promise<ItemTabela[]> {
  return page.evaluate(() => {
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("table > tbody > tr > td:nth-child(2) > a"),
    );

    return anchors
      .map((anchor) => ({
        id: (anchor.textContent || "").trim(),
        link: (anchor.getAttribute("href") || "").trim(),
        nomeCliente: "",
        nomeMotorista: "",
        cpfMotorista: "",
        origemDestino: "",
        placas: "",
        observacoes: "",
      }))
      .filter((item) => item.id.length > 0 && item.link.length > 0);
  });
}

async function obterDadosExpandido(
  page: Page,
): Promise<
  Pick<
    ItemTabela,
    "nomeCliente" | "nomeMotorista" | "cpfMotorista" | "origemDestino" | "placas" | "observacoes"
  >
> {
  await page
    .waitForSelector("span[data-testid=field-input-text-long-view-4]", {
      timeout: 15000,
    })
    .catch(() => undefined);

  return page.evaluate(() => {
    const texto = (selector: string): string => {
      const elemento = document.querySelector<HTMLElement>(selector);
      return (elemento?.innerText || "").trim();
    };

    return {
      nomeCliente: texto("span[data-testid=field-input-text-long-view-4]"),
      nomeMotorista: texto("span[data-testid=field-input-text-long-view-5]"),
      cpfMotorista: texto("span[data-testid=field-input-text-long-view-6]"),
      origemDestino: texto("span[data-testid=field-input-text-long-view-8]"),
      placas: texto("span[data-testid=field-input-text-long-view-10]"),
      observacoes: texto("div[data-testid=field-input-paragraph-rich-text-view-30]"),
    };
  });
}

async function processarLinks(page: Page, itens: ItemTabela[]): Promise<void> {
  for (const item of itens) {
    const destino = new URL(item.link, page.url()).toString();

    await page.goto(destino, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector(
      "button[data-testid=proforma-form-list-form-card-header-expand-button]",
      { timeout: 30000 },
    );
    await page.click("button[data-testid=proforma-form-list-form-card-header-expand-button]");

    const dadosExpandido = await obterDadosExpandido(page);
    Object.assign(item, dadosExpandido);
  }
}

async function scrollAtePararDeCarregar(page: Page): Promise<void> {
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

async function main() {
  const usuario = process.env.USUARIO;
  const senha = process.env.SENHA;
  const url = process.env.URL;

  if (!usuario || !senha || !url) {
    throw new Error("Usuário, senha e URL devem ser informados no .env");
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  try {
    const page = (await browser.pages())[0];

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("#user-email", { timeout: 30000 });
    await page.type("#user-email", usuario);
    await page.click("#login-button");

    await page.waitForSelector("#user-password", { timeout: 30000 });
    await page.type("#user-password", senha);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
      page.click("#login-button"),
    ]);

    await scrollAtePararDeCarregar(page);

    const itensTabela = (await obterLinksDaTabela(page));
    await processarLinks(page, itensTabela);
    salvarExcel(itensTabela);
  } finally {
    await browser.close();
  }
}

main().catch((error) => console.error("Falha na automacao:", error));
