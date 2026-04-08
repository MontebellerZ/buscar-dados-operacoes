import { Page } from "puppeteer";
import envData from "../config/envData";
import selectors from "../config/selectors";
import criarJanela from "./criarJanela";
import Api from "../api";

async function logar() {
  const { usuario, senha, url } = envData;
  
  console.info("Abrindo navegador para login.");

  const { browser, page } = await criarJanela();
  
  console.info("Preenchendo dados do usuário.");

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

  console.info("Logado com sucesso.");

  const cookies = await browser.cookies();
  Api.SetCookie(cookies);
  
  console.info("Cookies definidos.");

  await page.close();
  await browser.close();
  
  console.info("Navegador encerrado.");
}

export default logar;
