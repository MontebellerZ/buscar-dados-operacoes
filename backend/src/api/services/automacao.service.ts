import operacoesAtlassian from "../../automate/operacoesAtlassian";
import OperacaoService from "./operacao.service";
import BaseService from "./base.service";

class AutomacaoService extends BaseService {
  static async OperacoesAtlassian() {
    const extraido = await operacoesAtlassian();
    await OperacaoService.UpsertAutomacao(extraido);
    return await OperacaoService.GetAll();
  }
}

export default AutomacaoService;
