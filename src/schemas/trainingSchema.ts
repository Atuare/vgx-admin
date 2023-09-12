import * as yup from "yup";

export const trainingModalStatusSchema = yup
  .object({
    status: yup.string().required("Campo obrigatório"),
    reason: yup.string().when("status", {
      is: (status: string) => status !== "CONCLUÍDO",
      then: schema => schema.required("Campo obrigatório"),
      otherwise: schema => schema.optional(),
    }),
  })
  .required();
