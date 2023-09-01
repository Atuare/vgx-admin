import { UnitType } from "dayjs";
import { AdmissionResultType } from "./admissionResult.interface";

export interface AdmissionType {
  id: string;
  examiner: string;
  limitCandidates: number;
  startDate: Date;
  endDate: Date;
  time: Date;
  unit: UnitType;
  status: AdmissionStatusEnum;
  admissionResult: AdmissionResultType;
  createdAt: Date;
  updatedAt: Date;
}

enum AdmissionStatusEnum {
  CONCLUIDO = "CONCLUIDO",
  SUSPENSO = "SUSPENSO",
  CANCELADO = "CANCELADO",
  EMANDAMENTO = "EMANDAMENTO",
}
