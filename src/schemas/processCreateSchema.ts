import { isAfterYesterday } from "@/utils/dates";
import dayjs from "dayjs";
import * as yup from "yup";

export const processCreateStepOneSchema = yup
  .object({
    unit: yup.object().required("A unidade é obrigatória"),
    role: yup.object().required("O cargo é obrigatório"),
    requestCv: yup.boolean().required("O pedido de curriculo é obrigatório"),
    startDate: yup
      .date()
      .test(
        "isAfterYesterday",
        "A data deve ser maior que um dia atrás.",
        isAfterYesterday,
      )
      .test(
        "isBeforeEndDate",
        "A data inicial deve ser menor que a data final",
        function (value) {
          const { endDate } = this.parent;
          if (!endDate) return true;
          return dayjs(value).isBefore(dayjs(endDate as string));
        },
      )
      .required("A data inicial é obrigatória"),
    endDate: yup
      .mixed()
      .nullable()
      .test("is-date", "Data inválida", function (value) {
        return !value || dayjs(value as string).isValid();
      }),
    limitCandidates: yup.mixed().optional(),
    banner: yup
      .mixed()
      .test("required", "O banner é obrigatório", (file: File | any) => file),
    observations: yup.string().optional(),
    registrationCompletionMessage: yup.string().optional(),
  })
  .required();

export const processCreateStepTwoSchema = yup
  .object()
  .shape({
    type: yup.string().required("O tipo do processo é obrigatório"),
    skills: yup
      .array()
      .min(1, "As habilidades são obrigatórias")
      .required("As habilidades são obrigatórias"),
    availabilities: yup
      .array()
      .min(1, "As disponibilidades são obrigatórias")
      .required("As disponibilidades são obrigatórias"),
    schoolings: yup
      .array()
      .min(1, "As escolaridades são obrigatórias")
      .required("As escolaridades são obrigatórias"),
    benefits: yup
      .array()
      .min(1, "Os benefícios são obrigatórios")
      .required("Os benefícios são obrigatórios"),
    availableForMinors: yup
      .boolean()
      .required("A disponibilidade para menores é obrigatória"),
  })
  .required();
