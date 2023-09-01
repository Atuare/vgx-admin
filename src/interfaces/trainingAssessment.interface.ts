import { InitializeCandidacyAnsweringType } from "./initializeCandidacyAnswering.interface";
import { TrainingType } from "./training.interface";
import { TrainingAssessmentGradeType } from "./trainingAssessmentGrade.interface";
import { TrainingAssessmentQuestionType } from "./trainingAssessmentQuestion.interface";
import { TrainingDayType } from "./trainingDay.interface";

export interface TrainingAssessmentType {
  id: string;
  availableForCandidacies: boolean;
  questionsAmount: number;
  minimumPassingGrade: number;
  maxTimeToFinish: number;
  trainingAssessmentQuestions: TrainingAssessmentQuestionType[];
  trainingAssessmentGrades: TrainingAssessmentGradeType[];
  initializeCandidacyAnswering: InitializeCandidacyAnsweringType;
  training: TrainingType;
  trainingDay: TrainingDayType;
  dayNumber: number;
  createdAt: Date;
  updatedAt: Date;
}
