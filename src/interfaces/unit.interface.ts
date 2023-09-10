import { StatusEnum } from "@/enums/status.enum";

export interface IUnit {
  id: string;
  status: StatusEnum;
  unitName: string;
  unitAcronym: string;
  unitAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUnits {
  units: IUnit[];
  totalCount: number;
}
