import { StatusEnum } from "@/enums/status.enum";

export interface ISchooling {
  id: string;
  status: StatusEnum;
  schoolingName: string;
  informCourse: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISchoolings {
  schoolings: ISchooling[];
  totalCount: number;
}
