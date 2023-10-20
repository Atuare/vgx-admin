export type TRequirements =
  | "turnOffTime"
  | "typeOfTurnOffTime"
  | "timeBetweenProcesses"
  | "sellRate"
  | "sellAbs"
  | "misCalcTime";

export interface ISubscription {
  requirement: TRequirements;
  value: number | string;
  editable: boolean;
  id: number;
}

export interface IInscriptions {
  subscriptions: ISubscription[];
  totalCount: number;
}
