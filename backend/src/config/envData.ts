import "dotenv/config";

const getEnv = {
  URL: process.env.URL,
  BASE_URL: process.env.BASE_URL,
  API_PORT: process.env.API_PORT ? +process.env.API_PORT : 3001,
  WEB_PORT: process.env.WEB_PORT ? +process.env.WEB_PORT : 5173,
  WORKERS: process.env.WORKERS ? +process.env.WORKERS : 20,
  OUTPUT_PATH: process.env.OUTPUT_PATH ?? "dados-operacoes.xlsx",
  PROJECT_NAME: process.env.PROJECT_NAME,
};

const naoEncontrados = Object.entries(getEnv)
  .filter(([_, v]) => !v)
  .map(([k, _]) => k);

if (naoEncontrados.length) {
  throw new Error(`Valores não definidos no .env: ${naoEncontrados.join(", ")}`);
}

const envData = {
  url: getEnv.URL!,
  baseUrl: getEnv.BASE_URL!,
  workers: getEnv.WORKERS,
  outputPath: getEnv.OUTPUT_PATH,
  apiPort: getEnv.API_PORT,
  webPort: getEnv.WEB_PORT,
  projectName: getEnv.PROJECT_NAME!,
};

export default envData;
