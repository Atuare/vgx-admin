export const formatRG = (rg: string) => {
  if (!rg) return "";
  const numericRG = rg.replace(/\D/g, "");

  return numericRG.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
};
