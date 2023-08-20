import { ProcessesType } from "@/interfaces/process.interface";
import { createContext } from "react";

interface ProcessesDataContextType {
  processes: ProcessesType;
  setProcesses: (processes: ProcessesType) => void;
}

export const ProcessesDataContext = createContext(
  {} as ProcessesDataContextType,
);
