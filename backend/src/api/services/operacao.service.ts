import { BadRequestError, NotFoundError } from "../errors/errors";
import { TOperacaoAutomacao } from "../../types/operacaoAutomacao.type";
import OperacaoRepository from "../repositories/operacao.repository";
import BaseService from "./base.service";
import { Operacao } from "@prisma/client";

class OperacaoService extends BaseService {
  static async UpsertAutomacao(items: TOperacaoAutomacao[]) {
    if (!Array.isArray(items) || items.length === 0) return 0;

    const affected = await OperacaoRepository.UpsertAutomacao(items);

    return affected.length;
  }

  static async GetAll() {
    return await OperacaoRepository.GetAll();
  }

  static async Update(operacao: Partial<Operacao>) {
    if (!operacao.id) throw new BadRequestError("Id não informado");

    const updated = await OperacaoRepository.UpdateById(operacao.id, operacao);

    if (!updated) throw new NotFoundError("Operação não encontrada para atualização.");

    return updated;
  }

  static async Delete(id: number) {
    const removed = await OperacaoRepository.DeleteById(id);

    if (!removed) {
      throw new NotFoundError("Operação não encontrada para exclusão.");
    }

    return { id: id, ativo: false };
  }
}

export default OperacaoService;
