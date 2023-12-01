import { CandidacyType } from "./candidacy.interface";
import { TrainingDayType } from "./trainingDay.interface";

export interface TrainingParticipantDayType {
  id: string;
  candidacy: CandidacyType;
  trainingDay: TrainingDayType;
  presence: boolean;
  observation: string;
}
