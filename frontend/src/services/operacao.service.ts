import type { TOperacao } from "../types/operacao.type";
import BaseService from "./base.service";

class OperacaoService extends BaseService {
  static async GetAll() {
    return await this.get<TOperacao[]>("/operacao/");
  }

  static async Update(operacao: TOperacao) {
    return await this.post<TOperacao[]>("/operacao/", operacao);
  }

  static async Delete(operacaoId: number) {
    return await this.delete<Partial<TOperacao>>(`/operacao/${operacaoId}`);
  }
}

export default OperacaoService;
