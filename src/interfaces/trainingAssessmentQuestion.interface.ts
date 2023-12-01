import { TrainingAssessmentType } from "./trainingAssessment.interface";
import { TrainingParticipantQuestionAnswerType } from "./trainingParticipantQuestionAnswer.interface";
import { TrainingQuestionAlternativeType } from "./trainingQuestionAlternative.interface";

export interface TrainingAssessmentQuestionType {
  id: string;
  question: string;
  trainingParticipantQuestionAnswers: TrainingParticipantQuestionAnswerType[];
  alternatives: TrainingQuestionAlternativeType[];
  correctAlternative?: TrainingQuestionAlternativeType;
  trainingAssessment: TrainingAssessmentType;
  createdAt: Date;
  updatedAt: Date;
}
