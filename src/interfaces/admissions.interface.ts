import { AdmissionsStatusEnum, StatusEnum } from "@/enums/status.enum";

export interface IAdmission {
  id: string;
  examiner: string;
  limitCandidates: number;
  startDate: string;
  endDate: string;
  time: string;
  status: AdmissionsStatusEnum;
  createdAt: string;
  updatedAt: string;
  unit: {
    id: string;
    unitName: string;
    unitAcronym: string;
    unitAddress: string;
    status: StatusEnum;
    createdAt: string;
    updatedAt: string;
  };
  candidates: number;
}

export interface IAdmissions {
  admissions: IAdmission[];
  totalCount: number;
}
