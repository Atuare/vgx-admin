import { StatusEnum } from "@/enums/status.enum";

export interface ISkill {
  id: string;
  status: StatusEnum;
  skillText: string;
  createdAt: Date;
  updatedAt: Date;
}
