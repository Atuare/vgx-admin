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
  trainingTypeId: string;
  trainingAssessments: TrainingAssessmentType[];
}

interface TrainingAssessmentType {
  id: string;
  minimumPassingGrade: number;
  maxTimeToFinish: number;
  questionsAmount: number;
  orientationMessage: string;
  approvedMessage: string;
  disapprovedMessage: string;
  trainingDay: TrainingDayType;
  trainingAssessmentGrades: TrainingAssessmentGrade[];
  trainingAssessmentQuestions: IQuestion[];
}

export interface TrainingAssessmentGrade {
  candidacy: {
    id: string;
    grade: string;
    trainingAssessment: string;
  };
}

export interface IQuestion {
  id: string;
  question: string;
  alternatives: Alternative[];
  number: number;
}

interface Alternative {
  alternative: string;
  isCorrect: boolean;
}

export interface ITrainingCreateFormDefaultValue {
  trainingName: string;
  productName?: string;
  trainer: string;
  trainingDays: number;
  participantLimit: number;
  minimumFrequency: number;
  startDate: Date;
  endDate: Date;
  trainingLocation: string;
  trainingType: {
    id: string;
  };
  trainingAssessments: TrainingAssessmentType[];
  number: number;
}
