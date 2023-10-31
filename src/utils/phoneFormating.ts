export function formatPhoneNumber(input: string) {
  if (typeof input !== "string") return "";
  if (input === "") {
    return "";
  }
  const cleanedInput = input.replace(/\D/g, "").slice(0, 13);
  const match = cleanedInput.match(/^(\d{0,2})(\d{0,2})(\d{0,5})(\d{0,4})$/);

  if (!match) {
    return cleanedInput;
  }

  const formattedNumber = `+${match[1] || ""}${
    match[1] && match[2] ? " " : ""
  }${match[2] || ""}${match[2] && match[3] ? " " : ""}${match[3] || ""}${
    match[3] && match[4] ? "-" : ""
  }${match[4] || ""}`;
  return formattedNumber;
}

export function formatWhatsappNumber(input: string) {
  if (!input) return;
  return input.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}
