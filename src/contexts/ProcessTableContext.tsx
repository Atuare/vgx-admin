import { createContext } from "react";

interface ProcessTableContextType {
  defaultTableSize: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

export const ProcessTableContext = createContext({} as ProcessTableContextType);
