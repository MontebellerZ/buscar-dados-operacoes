import { Router } from "express";
import AutomacaoService from "../services/automacao.service";

const automacaoRoutes = Router();

automacaoRoutes.post("/operacoesAtlassian", async (_, res) => {
  const result = await AutomacaoService.OperacoesAtlassian();
  res.send(result);
});

export default automacaoRoutes;
