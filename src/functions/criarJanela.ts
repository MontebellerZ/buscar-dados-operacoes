import puppeteer, { Browser, Cookie, Page } from "puppeteer";

async function criarJanela(cookies?: Cookie[]): Promise<{
  browser: Browser;
  page: Page;
}> {
  const browser = await puppeteer.launch({ defaultViewport: null });
  const page = (await browser.pages())[0];

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    const resourceType = request.resourceType();
    if (resourceType === "image" || resourceType === "font" || resourceType === "media") {
      request.abort();
      return;
    }
    request.continue();
  });

  if (cookies) await browser.setCookie(...cookies);

  return { browser, page };
}

export default criarJanela;
