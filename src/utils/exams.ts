import { ExamsStatusEnum } from "@/enums/status.enum";

export const fakeExamsData = {
  exams: [
    {
      id: "26e19918-9148-478d-91aa-866e0a7b18d4",
      status: ExamsStatusEnum.EMANDAMENTO,
      limit: 10,
      startDate: "2021-09-01T00:00:00.000Z",
      endDate: "2021-09-30T00:00:00.000Z",
      local: "São Paulo",
      hour: "08:00",
      examiner: "João da Silva",
    },
    {
      id: "26e11218-9148-478d-91aa-866e0a7b18d4",
      status: ExamsStatusEnum.SUSPENSO,
      limit: 7,
      startDate: "2023-09-01T00:00:00.000Z",
      endDate: "2023-09-30T00:00:00.000Z",
      local: "Rio de Janeiro",
      hour: "18:00",
      examiner: "Carlinhos da Silva",
    },
    {
      id: "12e11218-9148-478d-91aa-866e0a7b18d4",
      status: ExamsStatusEnum.CANCELADO,
      limit: 25,
      startDate: "2023-06-01T00:00:00.000Z",
      endDate: "2023-06-30T00:00:00.000Z",
      local: "Bahia",
      hour: "10:00",
      examiner: "Carlinhos da Silva",
    },
    {
      id: "76e11218-9148-478d-91aa-866e0a7b18d4",
      status: ExamsStatusEnum.CONCLUIDO,
      limit: 17,
      startDate: "2023-02-01T00:00:00.000Z",
      endDate: "2023-02-30T00:00:00.000Z",
      local: "Tocantins",
      hour: "14:00",
      examiner: "Júnior Sena",
    },
  ],
  totalCount: 4,
};

export const examsStatus = [
  "EM ANDAMENTO",
  "CANCELADO",
  "SUSPENSO",
  "CONCLUÍDO",
];
