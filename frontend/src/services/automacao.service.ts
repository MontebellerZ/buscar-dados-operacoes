import type { TOperacao } from "../types/operacao.type";
import BaseService from "./base.service";

class OperacaoService extends BaseService {
  static async GetAll() {
    return await this.get<TOperacao[]>("/automacao/");
  }

  static async GetAllByNome(nome: string) {
    return await this.get<TOperacao[]>(`/automacao/all/${nome}`);
  }

  static async GetLastByNome(nome: string) {
    return await this.get<TOperacao[]>(`/automacao/last/${nome}`);
  }

  static async OperacoesAtlassian() {
    return await this.post<TOperacao[]>(`/automacao/run/operacoesAtlassian`);
  }
}

export default OperacaoService;
