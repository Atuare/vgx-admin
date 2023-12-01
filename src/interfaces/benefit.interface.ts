import { StatusEnum } from "@/enums/status.enum";

export interface IBenefit {
  id: string;
  status: StatusEnum;
  benefitName: string;
  createdAt: Date;
  updatedAt: Date;
}
