import { ICandidate } from "./candidate.interface";
import { ProcessType } from "./process.interface";

export interface InterviewType {
  id: string;
  link: string;
  date: Date;
  status: "AREALIZAR" | "NAOREALIZADO" | "APROVADO";
  candidacy: {
    candidate: ICandidate;
    process: ProcessType;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IInterviewsType {
  interviews: InterviewType[];
  totalCount: number;
}
