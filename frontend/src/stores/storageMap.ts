import type { TOperacao } from "../types/operacao.type";
import type { TUsuario } from "../types/usuario.type";

export type StorageMap = {
  UsuarioStorage: TUsuario;
  OperacaoStorage: TOperacao[];
  TabelaStorage: Record<string, string[]>;
};
