import envData from "../../../config/envData";
import criarJanela from "./criarJanela";
import Api from "../api";
import selectors from "../consts/selectors";
import { NotAuthorizedError } from "../../../api/errors/errors";

async function logar(email: string, senha: string) {
  const { url } = envData;

  console.info("Abrindo navegador para login.");

  const { browser, page } = await criarJanela();

  try {
    console.info("Preenchendo dados do usuário.");

    await page.goto(url, { waitUntil: "networkidle2" });

    try {
      await page.waitForSelector(selectors.userEmailInput, { timeout: 2000 });
      await page.type(selectors.userEmailInput, email);
      await page.click(selectors.loginButton);

      await page.waitForSelector(selectors.userPasswordInput, { timeout: 2000 });
      await page.type(selectors.userPasswordInput, senha);

      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }),
        page.click(selectors.loginButton),
      ]);
    } catch {
      throw new NotAuthorizedError("Credenciais inválidas.");
    }

    const cookies = await browser.cookies();

    const relavantCookies = ["customer.account.session.token", "atlassian.xsrf.token"];
    if (!relavantCookies.every((r) => cookies.find((c) => r === c.name))) {
      throw new NotAuthorizedError("Credenciais inválidas.");
    }

    console.info("Logado com sucesso.");

    Api.SetCookie(cookies);

    console.info("Cookies definidos.");
  } finally {
    await page.close();
    await browser.close();

    console.info("Navegador encerrado.");
  }
}

export default logar;
