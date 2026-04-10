import { Router } from "express";
import OperacaoService from "../services/operacao.service";
import { BadRequestError } from "../errors/errors";
import { Operacao } from "@prisma/client";

const operacaoRoutes = Router();

operacaoRoutes.get("/", async (_, res) => {
  const result = await OperacaoService.GetAll();
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
