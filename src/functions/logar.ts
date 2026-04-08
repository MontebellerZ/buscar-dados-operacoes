import { Page } from "puppeteer";
import envData from "../data/envData";
import selectors from "../data/selectors";

async function logar(page: Page) {
  const { usuario, senha, url } = envData;

  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForSelector(selectors.userEmailInput, { timeout: 30000 });
  await page.type(selectors.userEmailInput, usuario);
  await page.click(selectors.loginButton);

  await page.waitForSelector(selectors.userPasswordInput, { timeout: 30000 });
  await page.type(selectors.userPasswordInput, senha);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
    page.click(selectors.loginButton),
  ]);
}

export default logar;
