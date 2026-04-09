import { Router } from "express";
import automacaoRoutes from "./automacao.route";

const routes = Router();

routes.use("/automacao", automacaoRoutes);

routes.use("/", (req, res) => res.send(`[${req.method} ${req.originalUrl}] ✅ Alive`));

export default routes;
