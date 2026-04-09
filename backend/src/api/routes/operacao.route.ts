import { Router } from "express";

const operacaoRoutes = Router();

operacaoRoutes.get("/", async (_, res) => {
  // executar a busca de todas as operações no banco
});

operacaoRoutes.put("/", async (req, res) => {
  // executar o update de uma operacao no banco
});

operacaoRoutes.delete("/:id", async (req, res) => {
  // desativar uma operação no banco (soft delete)
});

export default operacaoRoutes;
