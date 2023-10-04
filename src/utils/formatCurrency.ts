export function formatCurrency(value: number | string) {
  let numericValue;
  typeof value === "string"
    ? (numericValue = value.replace(/\D/g, ""))
    : (numericValue = value);

  const formattedValue = (+numericValue / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formattedValue;
}
