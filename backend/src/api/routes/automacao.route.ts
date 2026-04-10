import { Router } from "express";
import AutomacaoService from "../services/automacao.service";

const automacaoRoutes = Router();

automacaoRoutes.get("/all", async (_, res) => {
  const result = await AutomacaoService.GetAll();
  res.send(result);
});

automacaoRoutes.get("/all/:nome", async (req, res) => {
  const nome = req.params.nome;
  const result = await AutomacaoService.GetAllByNome(nome);
  res.send(result);
});

automacaoRoutes.get("/last/:nome", async (req, res) => {
  const nome = req.params.nome;
  const result = await AutomacaoService.GetLastByNome(nome);
  res.send(result);
});

automacaoRoutes.post("/run/operacoesAtlassian", async (_, res) => {
  const result = await AutomacaoService.OperacoesAtlassian();
  res.send(result);
});

export default automacaoRoutes;
