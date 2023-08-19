import { StatusEnum } from "@/enums/status.enum";

export interface IAvailability {
  id: string;
  status: StatusEnum;
  startDay: number;
  endDay: number;
  startHour: number;
  endHour: number;
  createdAt: Date;
  updatedAt: Date;
}
