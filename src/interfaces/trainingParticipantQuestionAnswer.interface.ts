import { CandidacyType } from "./candidacy.interface";

export interface TrainingParticipantQuestionAnswerType {
  id: string;
  candidacy: CandidacyType;
  trainingAssessmentQuestion: string;
  answer: string;
}
