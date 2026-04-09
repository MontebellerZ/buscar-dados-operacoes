import { Router } from "express";
import automacaoRoutes from "./automacao.route";
import usuarioRoutes from "./usuario.route";

const routes = Router();

routes.use("/automacao", automacaoRoutes);
routes.use("/usuario", usuarioRoutes);

routes.use("/", (req, res) => res.send(`[${req.method} ${req.originalUrl}] ✅ Alive`));

export default routes;
