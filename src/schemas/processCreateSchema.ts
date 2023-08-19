import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as yup from "yup";
dayjs.extend(utc);

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
      .max(yup.ref("endDate"), "A data inicial deve ser menor que a final")
      .required("A data inicial é obrigatória"),
    endDate: yup
      .date()
      .min(yup.ref("startDate"), "A data final deve ser maior que a inicial")
      .optional()
      .required("A data final é obrigatória"),
    limitCandidates: yup.number().optional(),
    banner: yup
      .mixed()
      .test(
        "fileFormat",
        "O banner deve ser uma imagem PNG, JPG ou JPEG",
        (file: File | any) => {
          if (!file) return true; // Permite valores vazios

          const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
          return allowedFormats.includes(file?.type);
        },
      )
      .test(
        "fileSize",
        "O banner deve ter no máximo 5MB",
        (file: File | any) => {
          if (!file) return true; // Permite valores vazios

          const maxSize = 5 * 1024 * 1024; // 5MB
          return file?.size <= maxSize;
        },
      )
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
