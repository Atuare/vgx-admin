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

export const trainingCreateModalConfigSchema = yup.object().shape({
  text: yup.string().required("Campo obrigatório"),
  firstOption: yup.string().required("Campo obrigatório"),
  secondOption: yup.string().required("Campo obrigatório"),
  thirdOption: yup.string().required("Campo obrigatório"),
  fourthOption: yup.string().required("Campo obrigatório"),
  correctOption: yup
    .number()
    .nullable()
    .required("Selecione uma alternativa correta"),
});

export const trainingCreateSchema = yup.object().shape({
  trainingName: yup.string().required("Campo obrigatório"),
  productName: yup.string().optional(),
  trainer: yup.string().required("Campo obrigatório"),
  trainingDays: yup
    .number()
    .typeError("Número inválido")
    .min(1, "Digite um número maior que 0")
    .integer("Digite um número inteiro")
    .required("Campo obrigatório"),
  participantLimit: yup
    .number()
    .typeError("Número inválido")
    .min(1, "Digite um número maior que 0")
    .integer("Digite um número inteiro")
    .required("Campo obrigatório"),
  minimumFrequency: yup
    .number()
    .typeError("Número inválido")
    .min(0, "Digite um número maior ou igual a 0")
    .required("Campo obrigatório"),
  startDate: yup.string().required("Campo obrigatório"),
  endDate: yup.string().required("Campo obrigatório"),
  trainingLocation: yup.string().required("Campo obrigatório"),
  trainingType: yup.string().required("Campo obrigatório"),
});
