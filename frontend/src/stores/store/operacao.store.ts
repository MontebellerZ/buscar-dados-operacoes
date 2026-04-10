import type { TOperacao } from "../../types/operacao.type";
import BaseStorage from "./base.store";

export default class OperacaoStorage extends BaseStorage {
  static readonly mapKey = "OperacaoStorage";

  static get() {
    return this.localGet();
  }

  static save(operacoes: TOperacao[]) {
    return this.localSave(operacoes);
  }

  static getByChave(chave: string) {
    const operacoes = this.get();
    return operacoes?.find((o) => o.key === chave);
  }

  static saveByChave(operacao: TOperacao) {
    const operacoes = this.get() || [];

    const id = operacoes.findIndex((c) => c.key === operacao.key);

    if (id === -1) {
      operacoes.push(operacao);
      operacoes.sort((a, b) => a.key.localeCompare(b.key));
    } else {
      operacoes[id] = operacao;
    }

    return this.save(operacoes);
  }
}
