import { StatusEnum } from "@/enums/status.enum";
import { IProcessCandidacy } from "./processCandidacy.interface";
import { IRole } from "./role.interface";
import { IUnit } from "./unit.interface";

export interface ProcessType {
  id: string;
  type: "PRESENCIAL" | "REMOTO";
  unit: {
    id: string;
    unitName: string;
    unitAcronym: string;
    unitAddress: string;
    status: "ATIVO" | "INATIVO";
  };
  role: {
    id: string;
    roleText: string;
    roleDescription: string;
    status: "ATIVO" | "INATIVO";
  };
  status: "ATIVO" | "INATIVO";
  skills: [
    {
      id: string;
      skillText: string;
      status: "ATIVO" | "INATIVO";
    },
  ];
  availabilities: [
    {
      id: string;
      status: "ATIVO" | "INATIVO";
      startDay: number;
      endDay: number;
      startHour: number;
      endHour: number;
    },
  ];
  schoolings: [
    {
      id: string;
      status: "ATIVO" | "INATIVO";
      schoolingName: string;
      informCourse: boolean;
    },
  ];
  benefits: [
    {
      id: string;
      benefitName: string;
    },
  ];
  limitCandidates: number;
  startDate: string;
  endDate: string;
  requestCv: boolean;
  availableForMinors: boolean;
  observations: string;
  registrationCompletionMessage: string;
  createdAt: string;
  updatedAt: string;
  banner: string;
  candidacy?: IProcessCandidacy[];
}

export interface ProcessesType {
  processes: ProcessType[];
  totalCount: number;
}

export interface UnitsType {
  units: {
    id: string;
    unitName: string;
    unitAcronym: string;
    unitAddress: string;
    status: "ATIVO" | "INATIVO";
  }[];
  totalCount: number;
}

export interface RolesType {
  roles: {
    id: string;
    roleText: string;
    roleDescription: string;
    status: "ATIVO" | "INATIVO";
  }[];
  totalCount: number;
}

export interface IProcessCreateStepOneData {
  unit: IUnit;
  role: IRole;
  requestCv: boolean;
  startDate: Date;
  endDate?: Date;
  limitCandidates?: number;
  observations?: string;
  registrationCompletionMessage?: string;
  banner: File;
}
export interface IProcessCreateData {
  status: StatusEnum;
  type: string;
  unit: IUnit;
  role: IRole;
  skillsIds: string[];
  availabilitiesId: string[];
  schoolingsId: string[];
  benefitsId: string[];
  requestCv: boolean;
  availableForMinors: boolean;
  startDate: Date;
  endDate: Date;
  limitCandidates: number;
  observations?: string;
  registrationCompletionMessage?: string;
  banner: File;
}
