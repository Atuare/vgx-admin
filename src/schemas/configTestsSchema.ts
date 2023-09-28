import * as yup from "yup";

export const testsCreateConfigSchema = yup.object({
  maxTime: yup
    .number()
    .typeError("Número inválid")
    .required("Campo obrigatório"),
  portTotal: yup
    .number()
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  portMinScore: yup
    .number()
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  matTotal: yup
    .number()
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  matMinScore: yup
    .number()
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  compTotal: yup
    .number()
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  compMinScore: yup
    .number()
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  orientationMessage: yup.string().required("Campo obrigatório"),
  aproveMessage: yup.string().required("Campo obrigatório"),
  disapprovedMessage: yup.string().required("Campo obrigatório"),
  unitId: yup.string().required("Campo obrigatório"),
  // questions: yup.array().required("Campo obrigatório"),
});

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
