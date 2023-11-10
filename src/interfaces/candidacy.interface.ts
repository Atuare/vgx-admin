import { ExamClassCandidateStatusEnum } from "@/enums/status.enum";
import { AdmissionResultType } from "./admissionResult.interface";
import { IAvailability } from "./availability.interface";
import { ICandidate } from "./candidate.interface";
import { InterviewType } from "./interviews.interface";
import { ProcessType } from "./process.interface";
import { TrainingType } from "./training.interface";
import { TrainingParticipantDayType } from "./trainingParticipantDay.interface";
import { TrainingParticipantQuestionAnswerType } from "./trainingParticipantQuestionAnswer.interface";

export interface CandidacyType {
  id: string;
  status: CandidacyStatusEnum;
  candidate: ICandidate;
  training: TrainingType;
  process: ProcessType;
  trainingParticipantQuestionAnswers: TrainingParticipantQuestionAnswerType[];
  trainingParticipantDays: TrainingParticipantDayType[];
  interview: InterviewType;
  admissionResult: AdmissionResultType;
  availability: IAvailability;
  examStatus: ExamClassCandidateStatusEnum;
  createdAt: string;
  updatedAt: string;
  testResult: any;
}

export enum CandidacyStatusEnum {
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
  DESISTENTE = "DESISTENTE",
  PENDENTE = "PENDENTE",
}

export interface CandidacysType {
  candidacys: CandidacyType[];
  totalCount: number;
}
