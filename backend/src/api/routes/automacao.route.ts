import { Router } from "express";
import AutomacaoService from "../services/automacao.service";

const automacaoRoutes = Router();

automacaoRoutes.post("/operacoesAtlassian", async (_, res) => {
  try {
    const result = await AutomacaoService.OperacoesAtlassian();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

export default automacaoRoutes;
