import { CandidacyType } from "./candidacy.interface";
import { TrainingAssessmentType } from "./trainingAssessment.interface";
import { TrainingDayType } from "./trainingDay.interface";
import { TrainingGradeType } from "./trainingGrade.interface";
import { TrainingTypeType } from "./trainingType.interface";

export interface TrainingType {
  id: string;
  status: TrainingStatusEnum;
  trainingName: string;
  productName: string;
  trainer: string;
  trainingDays: number;
  participantLimit: number;
  minimumFrequency: number;
  trainingLocation: string;
  startDate: Date;
  endDate: Date;
  trainingType: TrainingTypeType;
  candidacies: CandidacyType[];
  trainingAssessments: TrainingAssessmentType[];
  trainingGrades: TrainingGradeType[];
  trainingDaysList: TrainingDayType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingsType {
  trainings: TrainingType[];
  totalCount: number;
}

export enum TrainingStatusEnum {
  CONCLUIDO = "CONCLUIDO",
  EM_ANDAMENTO = "EM ANDAMENTO",
  CANCELADO = "CANCELADO",
  SUSPENSO = "SUSPENSO",
}
