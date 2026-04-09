import { Cookie } from "puppeteer";
import envData from "../../../config/envData";
import { create } from "axios";
import { ItemTabela } from "../../../types/ItemTabela.type";
import ApiBody from "./bodys";
import {
  ResponseBuscarDadosExpandidos,
  ResponseBuscarIssueId,
  ResponseBuscarListaIssues,
} from "./responses";

const axios = create({
  baseURL: envData.baseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json", "User-Agent": "PostmanRuntime/7.53.0" },
});

class Api {
  static async SetCookie(cookies: Cookie[]) {
    const cookiesString = cookies.map((c) => `${c.name}=${c.value}`).join(";");
    axios.defaults.headers.common["Cookie"] = cookiesString;
  }

  static async BuscarListaIssues(): Promise<ItemTabela[]> {
    const results: ItemTabela[] = [];
    let nextToken: string | undefined = undefined;

    console.info("Buscando lista de itens.");

    let page = 0;
    do {
      const body = ApiBody.buscarListaIssues(nextToken);

      const data: ResponseBuscarListaIssues = await axios
        .post("/rest/servicedesk/1/customer/models", body)
        .then((res) => res.data);

      page++;
      console.info(`Rastreada a página ${page} de ${data.allReqFilter.totalPages}.`);

      const novosItens = data.allReqFilter.requestList.map((l): ItemTabela => ({ key: l.key }));

      results.push(...novosItens);
      nextToken = data.allReqFilter.nextToken;
    } while (nextToken);

    console.info(`Total de itens encontrados: ${results.length}.`);

    return results;
  }

  static async BuscarIssueId(key: ItemTabela["key"]) {
    const body = ApiBody.buscarIssueId(key);

    const data: ResponseBuscarIssueId = await axios
      .post("/rest/servicedesk/1/customer/models", body)
      .then((res) => res.data);

    return data.reqDetails.issue;
  }

  static async BuscarDadosExpandidos(id: ItemTabela["id"]) {
    const body = ApiBody.buscarDadosExpandidos();

    const data: ResponseBuscarDadosExpandidos = await axios
      .post(
        `/gateway/api/proforma/portal/cloudid/86b971b5-1cd4-4255-a68a-5ef02b4b50b7/api/cloud/portal/289/request/${id}/form/1/fielddata`,
        body,
      )
      .then((res) => res.data);

    return data;
  }
}

export default Api;
