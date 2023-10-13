import { ExamsStatusEnum } from "@/enums/status.enum";

export interface IExam {
  id: string;
  status: ExamsStatusEnum;
  limit: number;
  startDate: string;
  endDate: string;
  local: string;
  hour: string;
  examiner: string;
}

export interface IExams {
  exams: IExam[];
  totalCount: number;
}
