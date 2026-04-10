import { TOperacaoAutomacao } from "../../../types/operacaoAutomacao.type";

class ApiBody {
  static buscarListaIssues = (nextToken?: string) => ({
    options: {
      allReqFilter: {
        statusFilters: [
          {
            portalId: "289",
            statusInfo: [{ statusId: "10661" }],
          },
        ],
        nextToken: nextToken,
      },
    },
    models: ["allReqFilter", "xsrfToken"],
  });

  static buscarIssueId = (key: TOperacaoAutomacao["key"]) => ({
    options: {
      reqDetails: { key: key },
      portalId: 289,
    },
    models: ["reqDetails"],
  });

  static buscarDadosExpandidos = () => ({
    fields: [
      { fieldKey: "customfield_12197" },
      { fieldKey: "customfield_11736" },
      { fieldKey: "customfield_10107" },
      { fieldKey: "customfield_11769" },
      { fieldKey: "customfield_12209" },
      { fieldKey: "customfield_12186" },
      { fieldKey: "customfield_11678" },
      { fieldKey: "customfield_11590" },
      { fieldKey: "customfield_11773" },
      { fieldKey: "customfield_12222", format: "adf" },
      { fieldKey: "customfield_11577" },
    ],
  });
}

export default ApiBody;
