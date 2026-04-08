import envData from "./data/envData";
import { create } from "axios";

const axios = create({
  baseURL: envData.baseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

class Api {
  static async Login() {
    const { usuario, senha } = envData;

    const data = { email: usuario, password: senha };

    axios
      .post(
        "/jsd-login-v2/v2/customer/login/authenticate?continue=https://fretebras.atlassian.net/servicedesk/customer/portal/289",
        data,
      )
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static async BuscarIssueId() {
    const data = {
      options: {
        reqDetails: {
          key: "PARC-10632",
        },
        portalId: 289,
      },
      models: ["reqDetails"],
    };

    return await axios
      .post("/rest/servicedesk/1/customer/models", data)
      .then((res) => res.data.reqDetails.issue.id)
      .catch((err) => console.log(err));
  }

  static async BuscarDadosExpandidos() {
    const data = {
      fields: [
        {
          fieldKey: "customfield_12197",
        },
        {
          fieldKey: "customfield_11736",
        },
        {
          fieldKey: "customfield_10107",
        },
        {
          fieldKey: "customfield_11769",
        },
        {
          fieldKey: "customfield_12209",
        },
        {
          fieldKey: "customfield_12186",
        },
        {
          fieldKey: "customfield_11678",
        },
        {
          fieldKey: "customfield_11590",
        },
        {
          fieldKey: "customfield_11773",
        },
        {
          fieldKey: "customfield_12222",
          format: "adf",
        },
        {
          fieldKey: "customfield_11577",
        },
      ],
    };

    axios
      .post(
        `/gateway/api/proforma/portal/cloudid/86b971b5-1cd4-4255-a68a-5ef02b4b50b7/api/cloud/portal/289/request/424804/form/1/fielddata`,
        data,
      )
      .then((response) => console.log(JSON.stringify(response.data)))
      .catch((error) => console.log(error));
  }
}

export default Api;
