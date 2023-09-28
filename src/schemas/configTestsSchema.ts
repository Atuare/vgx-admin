import * as yup from "yup";

export const testsModalConfigSchema = yup
  .object({
    text: yup.string().required("Campo obrigatório"),
    type: yup
      .string()
      .oneOf(["PORTUGUESE", "MATHEMATICS", "COMPUTING"], "Tipo inválido")
      .required("Campo obrigatório"),
    firstOption: yup.string().required("Campo obrigatório"),
    secondOption: yup.string().required("Campo obrigatório"),
    thirdOption: yup.string().required("Campo obrigatório"),
    fourthOption: yup.string().required("Campo obrigatório"),
    correctOption: yup.number().required("Selecione uma alternativa correta"),
  })
  .required();
