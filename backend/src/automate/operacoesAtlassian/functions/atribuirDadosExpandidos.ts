import { ResponseBuscarDadosExpandidos } from "../api/responses";
import { Operacao } from "../../../types/Operacao.type";

function extrairDadosAdf(
  content: ResponseBuscarDadosExpandidos["customfield_12222"]["value"]["adf"]["content"] = [],
) {
  const texts = content
    .flatMap((paragrafo) => paragrafo?.content?.map((c) => c.text))
    .filter(Boolean)
    .map((t) => t!.split(":"))
    .map((t) => ({
      key: t[0]?.trim(),
      value: t[1]?.trim(),
    }))
    .filter((t) => t.key);

  return texts;
}

function pickDadosAdf(dados: ReturnType<typeof extrairDadosAdf>, key: string) {
  return dados.find((d) => d.key === key)?.value;
}

function atribuirDadosExpandidos(item: Operacao, dados: ResponseBuscarDadosExpandidos) {
  item.nomeCliente = dados.customfield_10107.value.text;
  item.nomeMotorista = dados.customfield_11769.value.text;
  item.cpfMotorista = dados.customfield_12209.value.text;
  item.origemDestino = dados.customfield_12186.value.text;
  item.placas = dados.customfield_11590.value.text;

  const linhasObservacao = extrairDadosAdf(dados.customfield_12222.value.adf.content);

  item.nf = pickDadosAdf(linhasObservacao, "NF");
  item.pedido = pickDadosAdf(linhasObservacao, "Pedido");
  item.qtdePlts = pickDadosAdf(linhasObservacao, "Qtde/Plts");
  item.freteLiquido = pickDadosAdf(linhasObservacao, "Frete Liquido / MP PREFORMA");
}

export default atribuirDadosExpandidos;
