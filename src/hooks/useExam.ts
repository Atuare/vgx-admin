import { IExam } from "@/interfaces/exams.interface";
import { useSelector } from "react-redux";

const useExam = () => {
  const exam: IExam | undefined = useSelector<any>(
    state => state?.examState?.exam,
  ) as IExam | undefined;

  return {
    exam,
  };
};

export default useExam;
