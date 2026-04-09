import operacoesAtlassian from "../automate/operacoesAtlassian";
import BaseService from "./base.service";

class AutomacaoService extends BaseService {
  static OperacoesAtlassian(...args: Parameters<typeof operacoesAtlassian>) {
    return operacoesAtlassian(...args);
  }
}

export default AutomacaoService;
