import logar from "../../automate/operacoesAtlassian/functions/logar";
import BaseService from "./base.service";

class UsuarioService extends BaseService {
  static async Login(email: string, senha: string) {
    return await logar(email, senha);
  }
}

export default UsuarioService;
