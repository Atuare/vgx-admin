import dayjs from "dayjs";
import * as yup from "yup";

const isAfterYesterday = (value?: Date | null) => {
  const currentDate = dayjs();
  const yesterday = currentDate.subtract(1, "day").endOf("day").utc();

  if (!value) {
    return true; // Permite valores undefined ou null
  }
  return (
    dayjs(value).isAfter(yesterday) ||
    new yup.ValidationError("A data deve ser maior que um dia atrás.")
  );
};

export const processCreateStepOneSchema = yup
  .object()
  .shape({
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
      .max(yup.ref("endDate"), "A data inicial deve ser menor que a final")
      .required("A data inicial é obrigatória"),
    endDate: yup
      .date()
      .min(yup.ref("startDate"), "A data final deve ser maior que a inicial")
      .optional()
      .required("A data final é obrigatória"),
    limitCandidates: yup
      .number()
      .min(1, "O limite de candidatos deve ser maior que 0")
      .required("O limite de candidatos é obrigatório"),
    banner: yup.object().required("O banner é obrigatório"),
    observations: yup.object().optional(),
    registrationCompletionMessage: yup.object().optional(),
  })
  .required();

export const processCreateStepTwoSchema = yup
  .object()
  .shape({
    type: yup.string().required("O tipo do processo é obrigatório"),
    skills: yup.array().required("As habilidades são obrigatórias"),
    availabilities: yup
      .array()
      .required("As disponibilidades são obrigatórias"),
    schoolings: yup.array().required("As escolaridades são obrigatórias"),
    benefits: yup.array().required("Os benefícios são obrigatórios"),
    availableForMinors: yup
      .boolean()
      .required("A disponibilidade para menores é obrigatória"),
  })
  .required();
