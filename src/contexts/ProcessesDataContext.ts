import { ProcessesType } from "@/@types/Process";
import { createContext } from "react";

interface ProcessesDataContextType {
  processes: ProcessesType;
  setProcesses: (processes: ProcessesType) => void;
  defaultTableSize: number;
}

export const ProcessesDataContext = createContext(
  {} as ProcessesDataContextType,
);
