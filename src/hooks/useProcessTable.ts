import { ProcessTableContext } from "@/contexts/ProcessTableContext";
import { useContext } from "react";

export function useProcessTable() {
  return useContext(ProcessTableContext);
}
