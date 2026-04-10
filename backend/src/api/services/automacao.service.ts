import operacoesAtlassian from "../../automate/operacoesAtlassian";
import OperacaoService from "./operacao.service";
import BaseService from "./base.service";
import AutomacaoRepository from "../repositories/automacao.repository";

class AutomacaoService extends BaseService {
  static async OperacoesAtlassian() {
    const extraido = await operacoesAtlassian();
    await OperacaoService.UpsertAutomacao(extraido);
    await AutomacaoRepository.Insert("operacoesAtlassian");
    return await OperacaoService.GetAll();
  }

  static async GetAll() {
    return await AutomacaoRepository.GetAll();
  }

  static async GetAllByNome(nome: string) {
    return await AutomacaoRepository.GetAllByNome(nome);
  }

  static async GetLastByNome(nome: string) {
    return await AutomacaoRepository.GetLastByNome(nome);
  }
}

export default AutomacaoService;
