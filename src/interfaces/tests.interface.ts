import { IUnit } from "./unit.interface";

export interface ITest {
  id: string;
  maxTime: number;
  portTotal: number;
  portMinScore: number;
  matTotal: number;
  matMinScore: number;
  compTotal: number;
  compMinScore: number;
  orientationMessage: string;
  aproveMessage: string;
  disapprovedMessage: string;
  createdAt: string;
  updatedAt: string;
  questions: IQuestion[];
  unit: IUnit;
}

export interface IQuestion {
  id: string;
  text: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  alternatives: Alternative[];
}

interface Alternative {
  id: string;
  alternative: string;
  createdAt: string;
  updatedAt: string;
}
export interface ITests {
  tests: ITest[];
  totalCount: number;
}
