import "dotenv/config";

const getEnv = {
  USUARIO: process.env.USUARIO,
  SENHA: process.env.SENHA,
  URL: process.env.URL,
  BASE_URL: process.env.BASE_URL,
  WORKERS: process.env.WORKERS ? +process.env.WORKERS : 20,
  OUTPUT_PATH: process.env.OUTPUT_PATH ?? "dados-operacoes.xlsx",
};

const naoEncontrados = Object.entries(getEnv)
  .filter(([_, v]) => !v)
  .map(([k, _]) => k);

if (naoEncontrados.length) {
  throw new Error(`Valores não definidos no .env: ${naoEncontrados.join(", ")}`);
}

const envData = {
  usuario: getEnv.USUARIO!,
  senha: getEnv.SENHA!,
  url: getEnv.URL!,
  baseUrl: getEnv.BASE_URL!,
  workers: getEnv.WORKERS,
  outputPath: getEnv.OUTPUT_PATH,
};

export default envData;
