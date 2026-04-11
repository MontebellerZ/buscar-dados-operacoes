import { Router } from "express";
import OperacaoService from "../services/operacao.service";
import { BadRequestError } from "../errors/errors";
import { Operacao } from "@prisma/client";

const operacaoRoutes = Router();

operacaoRoutes.get("/", async (req, res) => {
  const pageRaw = req.query.page;
  const limitRaw = req.query.limit;

  const hasPagination = pageRaw !== undefined || limitRaw !== undefined;

  if (!hasPagination) {
    const result = await OperacaoService.GetAll();
    res.send(result);
    return;
  }

  const page = Number(pageRaw ?? 1);
  const limit = Number(limitRaw ?? 50);

  if (!Number.isInteger(page) || page <= 0) {
    throw new BadRequestError("Parametro page deve ser um inteiro maior que 0.");
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new BadRequestError("Parametro limit deve ser um inteiro maior que 0.");
  }

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
