import * as yup from "yup";

export const testsModalConfigSchema = yup
  .object({
    text: yup.string().required("Campo obrigatório"),
    type: yup
      .string()
      .oneOf(["PORTUGUESE", "MATHEMATICS", "COMPUTING"], "Tipo inválido")
      .required("Campo obrigatório"),
  })
  .required();
