import { Browser, BrowserContext, Cookie, Page } from "puppeteer";

async function criarBrowserContext(
  browser: Browser,
  cookies?: Cookie[],
): Promise<{ page: Page; context: BrowserContext }> {
  const context = await browser.createBrowserContext();
  if (cookies) context.setCookie(...cookies);
  const page = await context.newPage();
  return { page, context };
}

export default criarBrowserContext;
