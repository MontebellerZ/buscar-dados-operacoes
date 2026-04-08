import puppeteer, { Browser, Cookie, Page } from "puppeteer";

async function criarJanela(cookies?: Cookie[]): Promise<{
  browser: Browser;
  page: Page;
}> {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = (await browser.pages())[0];

  if (cookies) await browser.setCookie(...cookies);

  return { browser, page };
}

export default criarJanela;
