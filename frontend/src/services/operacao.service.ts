import type { TOperacao, TOperacaoPaginada } from "../types/operacao.type";
import BaseService from "./base.service";

class OperacaoService extends BaseService {
  static async GetAll() {
    return await this.get<TOperacao[]>("/operacao");
  }

  static async GetPaginated(page: number, limit = 50) {
    return await this.get<TOperacaoPaginada>("/operacao", {
      params: {
        page,
        limit,
      },
    });
  }

  static async Update(operacao: TOperacao) {
    return await this.post<TOperacao[]>("/operacao", operacao);
  }

  static async Delete(operacaoId: number) {
    return await this.delete<Partial<TOperacao>>(`/operacao/${operacaoId}`);
  }
}

export default OperacaoService;
