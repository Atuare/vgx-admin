import { TrainingAssessmentQuestionType } from "./trainingAssessmentQuestion.interface";

export interface TrainingQuestionAlternativeType {
  id: string;
  alternative: string;
  isCorrect: boolean;
  trainingAssessmentQuestion: TrainingAssessmentQuestionType;
}
