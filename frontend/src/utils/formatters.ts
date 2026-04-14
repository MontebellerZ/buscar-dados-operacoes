const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatCurrency(value?: number | null) {
  if (typeof value !== "number") return "-";
  return currencyFormatter.format(value);
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "-";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return dateTimeFormatter.format(date);
}

export function formatText(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

export function formatCurrencyDigitsSanitized(value: string) {
  return value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

export function formatCurrencyToDigits(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";

  const cents = Math.round(value * 100);
  if (cents <= 0) return "";

  return String(cents);
}

export function formatCurrencyDigitsToNumber(digits: string) {
  const normalized = formatCurrencyDigitsSanitized(digits);
  if (!normalized) return undefined;

  const cents = Number(normalized);
  if (!Number.isFinite(cents)) return undefined;

  return cents / 100;
}

export function formatCurrencyMask(digits: string) {
  const normalized = formatCurrencyDigitsSanitized(digits);
  const padded = (normalized || "0").padStart(3, "0");
  const integerDigits = padded.slice(0, -2);
  const decimalDigits = padded.slice(-2);
  const integerNumber = Number(integerDigits);
  const integerFormatted = Number.isFinite(integerNumber)
    ? integerNumber.toLocaleString("pt-BR")
    : "0";

  return `R$ ${integerFormatted},${decimalDigits}`;
}
