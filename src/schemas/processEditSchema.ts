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
    .test("required", "O banner é obrigatório", (file: File | any) => file),
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
