import { StatusEnum } from "@/enums/status.enum";

export interface IUnit {
  id: string;
  status: StatusEnum;
  unitName: string;
  unitAcronym: string;
  unitAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUnits {
  units: IUnit[];
  totalCount: number;
}
