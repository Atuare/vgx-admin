import * as yup from "yup";

export const testsCreateConfigSchema = yup.object({
  maxTime: yup
    .number()
    .typeError("Número inválido")
    .min(1, "O tempo máximo deve ser maior que 0")
    .required("Campo obrigatório"),
  portTotal: yup
    .number()
    .integer("O valor deve ser inteiro")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  portMinScore: yup
    .number()
    .min(1, "A pontuação mínima deve ser maior que 0")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  matTotal: yup
    .number()
    .integer("O valor deve ser inteiro")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  matMinScore: yup
    .number()
    .min(1, "A pontuação mínima deve ser maior que 0")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  compTotal: yup
    .number()
    .integer("O valor deve ser inteiro")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  compMinScore: yup
    .number()
    .min(1, "A pontuação mínima deve ser maior que 0")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  orientationMessage: yup.string().required("Campo obrigatório"),
  aproveMessage: yup.string().required("Campo obrigatório"),
  disapprovedMessage: yup.string().required("Campo obrigatório"),
  unitId: yup.string().required("Campo obrigatório"),
  questions: yup
    .array()
    .test({
      message: "É necessário no mínimo criar uma questão",
      test: arr => arr && arr.length > 0,
    })
    .required("É necessário no mínimo criar uma questão"),
});

export const testsModalConfigSchema = yup
  .object({
    text: yup.string().required("Campo obrigatório"),
    type: yup.string().required("Campo obrigatório"),
    firstOption: yup.string().required("Campo obrigatório"),
    secondOption: yup.string().required("Campo obrigatório"),
    thirdOption: yup.string().required("Campo obrigatório"),
    fourthOption: yup.string().required("Campo obrigatório"),
    correctOption: yup
      .number()
      .nullable()
      .required("Selecione uma alternativa correta"),
  })
  .required();
