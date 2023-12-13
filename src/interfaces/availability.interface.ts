import { StatusEnum } from "@/enums/status.enum";

export interface IAvailability {
  id: string;
  status: StatusEnum;
  shift: "MANHÃ" | "TARDE" | "NOITE";
  startHour: string;
  endHour: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvailabilities {
  availabilities: IAvailability[];
  totalCount: number;
}
