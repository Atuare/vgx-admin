import { AdmissionsStatusEnum, StatusEnum } from "@/enums/status.enum";
import { ProcessType } from "./process.interface";

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

export interface IAdmissionCandidate {
  id: string;
  status: AdmissionsStatusEnum;
  accessContract: boolean;
  document: string;
  contractStatus: AdmissionsStatusEnum;
  createdAt: string;
  updatedAt: string;
  candidacy: {
    id: string;
    status: AdmissionsStatusEnum;
    createdAt: string;
    updatedAt: string;
    candidate: Candidate;
    process: ProcessType;
  };
}

interface Candidate {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  whatsapp: string;
  birthdate: string;
  firstAccess: boolean;
  notifyEmail: boolean;
  notifyWhats: boolean;
  acceptTerms: boolean;
  gender: string;
  civilStatus: string;
  state: string;
  county: string;
  motherName: string;
  fatherName: string;
  childUnderfourteen: boolean;
  childCount: number;
  curriculum: string;
  createdAt: string;
  updatedAt: string;
  documents: string;
  complementaryInfo: {
    hasCellPhone: boolean;
    hasCellPc: boolean;
    hasInternet: boolean;
    weekendObjection: boolean;
    haveDisability: boolean;
    disabilityDescription: string;
    hasMedicalReport: boolean;
    transportVoucher: boolean;
    transportCompany: string;
    transportLine: string;
    transportTaxGoing: string;
    transportTaxReturn: string;
    transportTaxDaily: string;
  };
}

export interface IAdmissions {
  admissions: IAdmission[];
  totalCount: number;
}
