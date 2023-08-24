import { IUnit } from "./unit.interface";

export interface InterviewType {
  id: string;
  link: string;
  date: Date;
  status: "AREALIZAR" | "NAOREALIZADO" | "APROVADO";
  candidacy: {
    candidate: {
      name: string;
      cpf: string;
    };
    process: {
      unit: IUnit;
    };
  };
}

export interface IInterviewsType {
  interviews: InterviewType[];
  totalCount: number;
}
