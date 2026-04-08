import { ResponseBuscarIssueId } from "../api/responses";
import { ItemTabela } from "../types";

function atribuirDadosIssue(
  item: ItemTabela,
  dados: ResponseBuscarIssueId["reqDetails"]["issue"],
) {
  item.id = dados.id;
  item.date = dados.date ? new Date(dados.date) : undefined;
}

export default atribuirDadosIssue;
