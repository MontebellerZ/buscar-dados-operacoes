import { ResponseBuscarIssueId } from "../api/responses";
import { Operacao } from "../../../types/Operacao.type";

function atribuirDadosIssue(
  item: Operacao,
  dados: ResponseBuscarIssueId["reqDetails"]["issue"],
) {
  item.id = dados.id;
  item.date = dados.date ? new Date(dados.date) : undefined;
}

export default atribuirDadosIssue;
