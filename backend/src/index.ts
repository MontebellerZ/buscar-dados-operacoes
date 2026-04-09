import express from "express";
import envData from "./config/envData";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(envData.apiPort, () => console.info(`Rodando na porta ${envData.apiPort}`));
