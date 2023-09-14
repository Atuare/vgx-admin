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
  createdAt: Date;
  updatedAt: Date;
}

enum CandidacyStatusEnum {
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
  DESISTENTE = "DESISTENTE",
  PENDENTE = "PENDENTE",
}
