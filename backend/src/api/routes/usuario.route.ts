import { Router } from "express";
import logar from "../../automate/operacoesAtlassian/functions/logar";
import { RequestUsuarioLogin } from "../types/request/RequestUsuarioLogin.type";
import UsuarioService from "../services/usuario.service";

const usuarioRoutes = Router();

usuarioRoutes.post("/login", async (req, res) => {
  const { email, senha } = req.body as RequestUsuarioLogin;

  UsuarioService.Login(email, senha);

  res.send();
});

export default usuarioRoutes;
