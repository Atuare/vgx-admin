export interface IFormations {
  id: string;
  type: "BASICA" | "TECNICA" | "SUPERIOR";
  course: string;
  status: "COMPLETO" | "ANDAMENTO" | "SUSPENSO";
  period: "MATUTINO" | "VESPERTINO" | "NOTURNO";
}
