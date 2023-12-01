export function formatCEP(cepInput?: string) {
  const cepValue = cepInput?.replace(/\D/g, "");

  const formattedCepValue = cepValue
    ?.replace(/\D/g, "")
    .replace(/(\d{5})(\d{3})/, "$1-$2");

  return formattedCepValue;
}
