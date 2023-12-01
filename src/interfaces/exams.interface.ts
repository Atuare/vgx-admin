import {
  ExamClassCandidateStatusEnum,
  ExamsStatusEnum,
} from "@/enums/status.enum";
import { CandidacyStatusEnum } from "./candidacy.interface";
import { ICandidate } from "./candidate.interface";
import { ProcessType } from "./process.interface";
import { TrainingType } from "./training.interface";

export interface IExam {
  id: string;
  status: ExamsStatusEnum;
  reason: string;
  examiner: string;
  startDate: string;
  endDate: string;
  candidateLimit: number;
  location: string;
  time: string;
}

export interface IExams {
  data: IExam[];
}

export interface IExamDetail {
  id: string;
  status: CandidacyStatusEnum;
  examId: string;
  examReason: string;
  examStatus: ExamClassCandidateStatusEnum;
  training: TrainingType;
  process: ProcessType;
  candidate: ICandidate;
}

export interface IExamDetails {
  data: IExamDetail[];
}
