import converterStringParaNumero from "../../../utils/converterStringParaNumero";
import { ResponseBuscarDadosExpandidos } from "../api/responses";

function extrairDadosAdf(
  content: ResponseBuscarDadosExpandidos["customfield_12222"]["value"]["adf"]["content"] = [],
) {
  const texts = content
    .flatMap((paragrafo) => paragrafo?.content?.map((c) => c.text))
    .filter(Boolean)
    .map((t) => t!.split(":"))
    .map((t) => ({ key: t[0]?.trim(), value: t[1]?.trim() }))
    .filter((t) => t.key);

  return texts;
}

function pickDadosAdf(dados: ReturnType<typeof extrairDadosAdf>, key: string) {
  return dados.find((d) => d.key === key)?.value;
}

function converterDadosExpandidos(dados: ResponseBuscarDadosExpandidos) {
  const linhasObservacao = extrairDadosAdf(dados.customfield_12222.value.adf.content);

  const freteString = pickDadosAdf(linhasObservacao, "Frete Liquido / MP PREFORMA");
  const freteNumber = converterStringParaNumero(freteString);

  return {
    nomeCliente: dados.customfield_10107.value.text?.trim(),
    nomeMotorista: dados.customfield_11769.value.text?.trim(),
    cpfMotorista: dados.customfield_12209.value.text?.trim(),
    origemDestino: dados.customfield_12186.value.text?.trim(),
    placas: dados.customfield_11590.value.text?.trim(),
    nf: pickDadosAdf(linhasObservacao, "NF")?.trim(),
    pedido: pickDadosAdf(linhasObservacao, "Pedido")?.trim(),
    qtdePlts: pickDadosAdf(linhasObservacao, "Qtde/Plts")?.trim(),
    freteLiquido: freteNumber,
  };
}

export default converterDadosExpandidos;
