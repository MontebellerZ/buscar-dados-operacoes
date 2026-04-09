import { Router } from "express";
import logar from "../../automate/operacoesAtlassian/functions/logar";
import { RequestUsuarioLogin } from "../types/request/RequestUsuarioLogin.type";

const usuarioRoutes = Router();

usuarioRoutes.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body as RequestUsuarioLogin;

    const result = await logar(email, senha);

    if (result) res.send();
    else res.status(401).send("Credenciais inválidas.");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export default usuarioRoutes;
