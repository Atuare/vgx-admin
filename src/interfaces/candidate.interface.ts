import { ComplementaryInfoType } from "./complementaryInfo.interface";
import { IFormations } from "./formations.interface";
import { UserDocumentType } from "./userDocument.interface";

export interface ICandidate {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: any;
  whatsapp: string;
  birthdate: string;
  firstAccess: boolean;
  notifyEmail: boolean;
  notifyWhats: boolean;
  acceptTerms: boolean;
  gender: any;
  civilStatus: any;
  state: any;
  county: any;
  motherName: any;
  fatherName: any;
  childUnderfourteen: boolean;
  childCount: any;
  curriculum: any;
  createdAt: string;
  updatedAt: string;
  complementaryInfo: ComplementaryInfoType;
  formations: IFormations;
  documents: UserDocumentType;
  address: IAddress;
  results: {
    result: "APROVADO" | "REPROVADO";
    reason: string;
    observation: string;
    interviewer: string;
  };
  availabilityId: string;
}

export interface ICandidates {
  data: ICandidate[];
  total: number;
  page: number;
  items: number;
}

interface IAddress {
  zipCode: string;
  address: string;
  neighborhood: string;
  number: string;
  complement: string;
  state: string;
}
