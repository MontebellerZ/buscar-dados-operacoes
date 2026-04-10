function converterStringParaNumero(valor?: string) {
  if (!valor) return undefined;

  const valorNormalizado = valor.replace(/[^\d,.-]/g, "");

  if (!valorNormalizado) return undefined;

  const possuiVirgula = valorNormalizado.includes(",");
  const possuiPonto = valorNormalizado.includes(".");

  let numeroNormalizado = valorNormalizado;

  if (possuiVirgula && possuiPonto) {
    const ultimaVirgula = valorNormalizado.lastIndexOf(",");
    const ultimoPonto = valorNormalizado.lastIndexOf(".");
    const separadorDecimal = ultimaVirgula > ultimoPonto ? "," : ".";

    numeroNormalizado =
      separadorDecimal === ","
        ? valorNormalizado.replace(/\./g, "").replace(",", ".")
        : valorNormalizado.replace(/,/g, "");
  } else if (possuiVirgula || possuiPonto) {
    const partes = valorNormalizado.split(/[,.]/g);
    const ultimaParte = partes.at(-1) ?? "";

    numeroNormalizado =
      ultimaParte.length === 2 ? `${partes.slice(0, -1).join("")}.${ultimaParte}` : partes.join("");
  }

  const numero = Number(numeroNormalizado);

  return Number.isFinite(numero) ? numero : undefined;
}

export default converterStringParaNumero;
