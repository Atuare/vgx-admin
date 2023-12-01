import { CandidacyType } from "./candidacy.interface";
import { TrainingAssessmentType } from "./trainingAssessment.interface";

export interface InitializeCandidacyAnsweringType {
  id: string;
  candidacy: CandidacyType;
  trainingAssessment: TrainingAssessmentType;
}
