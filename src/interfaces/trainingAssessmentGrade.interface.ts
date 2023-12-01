import { CandidacyType } from "./candidacy.interface";
import { TrainingAssessmentType } from "./trainingAssessment.interface";

export interface TrainingAssessmentGradeType {
  candidacy: CandidacyType;
  trainingAssessment: TrainingAssessmentType;
  grade: string;
}
