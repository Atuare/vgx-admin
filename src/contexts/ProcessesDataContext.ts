import { ProcessesType } from "@/interfaces/process.interface";
import { createContext } from "react";

interface ProcessesDataContextType {
  processes: ProcessesType;
  setProcesses: (processes: ProcessesType) => void;
  defaultTableSize: number;
}

export const ProcessesDataContext = createContext(
  {} as ProcessesDataContextType,
);
