import { ProcessType } from "@/interfaces/process.interface";
import { useSelector } from "react-redux";

export const useProcessEdit = () => {
  const processEdit: Partial<ProcessType> | undefined = useSelector<
    any,
    Partial<ProcessType>
  >(state => state?.processEditState.processEdit);

  return {
    processEdit,
  };
};
