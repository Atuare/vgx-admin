import { AdmissionType } from "./admission.interface";
import { CandidacyType } from "./candidacy.interface";

export interface AdmissionResultType {
  id: string;
  status: AdmissionResultStepsEnum;
  accessContract: boolean;
  document: string;
  contractStatus: ContractStatusEnum;
  candidacy: CandidacyType;
  admission: AdmissionType;
  createdAt: Date;
  updatedAt: Date;
}

enum AdmissionResultStepsEnum {
  ASSINADO = "ASSINADO",
  PENDENTE = "PENDENTE",
  NAOASSINADO = "NAOASSINADO",
}

enum ContractStatusEnum {
  ASSINADO = "ASSINADO",
  PENDENTE = "PENDENTE",
  NAOASSINADO = "NAOASSINADO",
}
