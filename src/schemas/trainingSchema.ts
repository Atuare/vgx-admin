import * as yup from "yup";

export const trainingModalStatusSchema = yup
  .object({
    status: yup.string().required("Campo obrigatório"),
    reason: yup.string().required("Campo obrigatório"),
  })
  .required();
