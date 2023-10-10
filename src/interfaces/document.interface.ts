import {
  DocumentCandidateStatusEnum,
  DocumentStatusEnum,
} from "@/enums/status.enum";
import { IUnit } from "./unit.interface";

export interface IDocument {
  id: string;
  status: DocumentStatusEnum;
  cpf: string;
  name: string;
  whatsapp: string;
  unit: IUnit;
  createdAt: string;
  documents: ICandidateDocument[];
}

export interface IDocuments {
  documents: IDocument[];
  totalCount: number;
}

export interface ICandidateDocument {
  id: string;
  status: DocumentCandidateStatusEnum;
  name: string;
  observation: string;
  mandatory: boolean;
  createdAt: string;
  updatedAt: string;
}
