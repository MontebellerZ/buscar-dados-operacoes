import { NextFunction, Request, Response, Router } from "express";
import automacaoRoutes from "./automacao.route";
import usuarioRoutes from "./usuario.route";
import operacaoRoutes from "./operacao.route";
import { HttpError } from "../errors/errors";

const routes = Router();

routes.use("/automacao", automacaoRoutes);
routes.use("/operacao", operacaoRoutes);
routes.use("/usuario", usuarioRoutes);

routes.use("/", (req, res) => res.send(`[${req.method} ${req.originalUrl}] ✅ Alive`));

routes.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof HttpError) {
    res.status(err.code).send(err.message);
    return;
  }

  res.status(500).send("Erro inesperado");
});

export default routes;
