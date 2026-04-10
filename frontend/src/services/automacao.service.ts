import type { TOperacao } from "../types/operacao.type";
import BaseService from "./base.service";

export type TAutomacaoRun = {
  id: number;
  automacao: string;
  criadoEm: string;
};

class AutomacaoService extends BaseService {
  static async GetAll() {
    return await this.get<TAutomacaoRun[]>("/automacao/all");
  }

  static async GetAllByNome(nome: string) {
    return await this.get<TAutomacaoRun[]>(`/automacao/all/${nome}`);
  }

  static async GetLastByNome(nome: string) {
    return await this.get<TAutomacaoRun | null>(`/automacao/last/${nome}`);
  }

  static async OperacoesAtlassian() {
    return await this.post<TOperacao[]>(`/automacao/run/operacoesAtlassian`);
  }
}

export default AutomacaoService;
