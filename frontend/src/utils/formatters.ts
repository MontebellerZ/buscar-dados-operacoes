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
