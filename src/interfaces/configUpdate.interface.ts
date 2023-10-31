export type TUpdateOptions =
  | "MIS"
  | "Jurídico"
  | "Funcionários"
  | "Desligamentos";

export interface IMISData {
  document: string;
  date: string;
  sellCount: number;
  missCount: number;
  selectCount: number;
  rateCount: number;
}

export interface IShutdownData {
  document: string;
  date: string;
  type: string;
}

export interface ICPFData {
  document: string;
}
