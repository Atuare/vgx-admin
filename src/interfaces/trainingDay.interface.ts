import { TrainingType } from "./training.interface";
import { TrainingParticipantDayType } from "./trainingParticipantDay.interface";

export interface TrainingDayType {
  id: string;
  dayNumber: number;
  trainingParticipantDays: TrainingParticipantDayType[];
  training: TrainingType;
  createdAt: Date;
  updatedAt: Date;
}
