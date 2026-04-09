import type { TOperacao } from "../types/operacoes.type";
import type { TUsuario } from "../types/usuario.type";

export type StorageMap = {
  UsuarioStorage: TUsuario;
  OperacoesStorage: TOperacao[];
};
