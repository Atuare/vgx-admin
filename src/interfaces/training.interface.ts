import { CandidacyType } from "./candidacy.interface";
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

export interface ITrainingCreateForm {
  trainingName: string;
  productName?: string;
  trainer: string;
  trainingDays: number;
  participantLimit: number;
  minimumFrequency: number;
  startDate: Date;
  endDate: Date;
  trainingLocation: string;
  trainingType: string;
  trainingAssessments: TrainingAssessmentType[];
}

interface TrainingAssessmentType {
  minimumPassingGrade: number;
  maxTimeToFinish: number;
  questionsAmount: number;
  orientationMessage: string;
  aproveMessage: string;
  disapprovedMessage: string;
  trainingAssessmentQuestions: IQuestion[];
}

export interface IQuestion {
  text: string;
  alternatives: Alternative[];
}

interface Alternative {
  alternative: string;
  isCorrect: boolean;
}
