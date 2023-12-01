export interface ComplementaryInfoType {
  id: string;
  hasCellPhone: boolean;
  hasCellPc: boolean;
  hasInternet: boolean;
  weekendObjection: boolean;
  haveDisability: boolean;
  disabilityDescription: string;
  hasMedicalReport: boolean;
  medicalReport: any; // ! Must change type accordingly to response type
  transportVoucher: boolean;
  transportCompany: string;
  transportLine: string;
  transportTaxGoing: string;
  transportTaxReturn: string;
  transportTaxDaily: string;
  createdAt: string;
  updatedAt: string;
}
