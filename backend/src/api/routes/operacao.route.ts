import { Router } from "express";
import OperacaoService from "../services/operacao.service";
import { BadRequestError } from "../errors/errors";
import { Operacao } from "@prisma/client";

const operacaoRoutes = Router();

operacaoRoutes.get("/", async (req, res) => {
  const pageRaw = Number(req.query.page);
  const limitRaw = Number(req.query.limit);

  const page = Number.isFinite(pageRaw) ? pageRaw : undefined;
  const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;

  const result = await OperacaoService.GetPaginated(page, limit);
  
  res.send(result);
});

operacaoRoutes.put("/", async (req, res) => {
  const body = req.body as Operacao;

  if (!Number.isFinite(body.id)) {
    throw new BadRequestError("Id da operação é obrigatório.");
  }

  const result = await OperacaoService.Update(body);
  res.send(result);
});

operacaoRoutes.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id)) {
    throw new BadRequestError("Id da operação inválido.");
  }

  const result = await OperacaoService.Delete(id);
  res.send(result);
});

export default operacaoRoutes;
