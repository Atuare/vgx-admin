import {
  AdmissionContractStatusEnum,
  AdmissionsStatusEnum,
  StatusEnum,
} from "@/enums/status.enum";
import { IAvailability } from "./availability.interface";
import { ICandidate } from "./candidate.interface";
import { ProcessType } from "./process.interface";

export interface IAdmission {
  id: string;
  examiner: string;
  limitCandidates: number;
  date: Date;
  status: AdmissionsStatusEnum;
  createdAt: string;
  updatedAt: string;
  product: string;
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

export interface IAdmissionCandidate {
  id: string;
  status: AdmissionsStatusEnum;
  accessContract: boolean;
  document: string;
  contractStatus: AdmissionContractStatusEnum;
  createdAt: string;
  updatedAt: string;
  candidacy: {
    id: string;
    status: AdmissionsStatusEnum;
    createdAt: string;
    updatedAt: string;
    candidate: ICandidate;
    process: ProcessType;
    availability: IAvailability;
  };
}

export interface IAdmissions {
  admissions: IAdmission[];
  totalCount: number;
}

export interface IAdmissionResult {
  admission: IAdmission;
  admissionResult: IAdmissionCandidate[];
  totalCount: number;
}
