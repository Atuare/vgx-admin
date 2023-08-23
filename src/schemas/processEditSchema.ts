import * as yup from "yup";

export const processEditStepOneSchema = yup.object({
  unit: yup.object().optional(),
  role: yup.object().optional(),
  requestCv: yup.boolean().optional(),
  startDate: yup
    .date()
    .test(
      "isBeforeEndDate",
      "A data inicial deve ser menor que a final",
      function (startDate: any) {
        if (!startDate) return true;

        const endDate = this.parent.endDate;
        if (!endDate) return true;

        return startDate <= endDate;
      },
    )
    .test(
      "isAfterYesterday",
      "A data deve ser maior que um dia atrás.",
      function (startDate: any) {
        if (!startDate) return true;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return startDate > yesterday;
      },
    )
    .optional(),
  endDate: yup.date().optional(),
  limitCandidates: yup.number().optional(),
  banner: yup
    .mixed()
    .test(
      "fileFormat",
      "O banner deve ser uma imagem PNG, JPG ou JPEG",
      (file: File | any) => {
        if (!file) return true; // Permite valores vazios
        if (typeof file === "string") return true; // Permite valores já salvos (string

        const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
        return allowedFormats.includes(file?.type);
      },
    )
    .test("fileSize", "O banner deve ter no máximo 5MB", (file: File | any) => {
      if (!file) return true; // Permite valores vazios
      if (typeof file === "string") return true; // Permite valores já salvos (string)

      const maxSize = 5 * 1024 * 1024; // 5MB
      return file?.size <= maxSize;
    })
    .optional(),
  observations: yup.string().optional(),
  registrationCompletionMessage: yup.string().optional(),
});

export const processEditStepTwoSchema = yup.object().shape({
  type: yup.string().optional(),
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
  availableForMinors: yup.boolean().optional(),
});
