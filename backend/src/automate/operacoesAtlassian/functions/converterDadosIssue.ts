import { ResponseBuscarIssueId } from "../api/responses";

function converterDadosIssue(dados: ResponseBuscarIssueId["reqDetails"]["issue"]) {
  return {
    issueId: dados.id,
    date: new Date(dados.date),
  };
}

export default converterDadosIssue;
