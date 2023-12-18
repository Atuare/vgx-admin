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

export const trainingCreateSchema = yup.object({
  trainingName: yup.string().required("Campo obrigatório"),
  productName: yup.string().optional(),
  trainer: yup.string().required("Campo obrigatório"),
  assessmentsAmount: yup
    .number()
    .typeError("Número inválido")
    .min(1, "Digite um número maior que 0")
    .integer("Digite um número inteiro")
    .required("Campo obrigatório"),
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
    .max(100, "Digite um número menor ou igual a 100")
    .required("Campo obrigatório"),
  startDate: yup
    .date()
    .typeError("Data inválida")
    .required("Campo obrigatório")
    .min(new Date(), "Data inicial deve ser maior que a data atual")
    .max(yup.ref("endDate"), "Data inicial deve ser menor que a data final"),
  endDate: yup
    .date()
    .typeError("Data inválida")
    .required("Campo obrigatório")
    .min(yup.ref("startDate"), "Data final deve ser maior que a data inicial"),
  trainingLocation: yup.string().required("Campo obrigatório"),
  trainingTypeId: yup.string().required("Campo obrigatório"),
  trainingAssessments: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          minimumPassingGrade: yup
            .number()
            .typeError("Número inválido")
            .min(1, "Digite um número maior ou igual a 1")
            .required("Campo obrigatório"),
          maxTimeToFinish: yup
            .number()
            .typeError("Número inválido")
            .min(1, "Digite um número maior ou igual a 1")
            .required("Campo obrigatório"),
          questionsAmount: yup
            .number()
            .integer("Digite um número inteiro")
            .typeError("Número inválido")
            .min(1, "Digite um número maior ou igual a 1")
            .required("Campo obrigatório"),
          orientationMessage: yup.string().required("Campo obrigatório"),
          approvedMessage: yup.string().required("Campo obrigatório"),
          disapprovedMessage: yup.string().required("Campo obrigatório"),
          trainingAssessmentQuestions: yup
            .array()
            .test({
              message: "É necessário no mínimo criar uma questão",
              test: arr => arr && arr.length > 0,
            })
            .required("Campo obrigatório"),
        })
        .required("Campo obrigatório"),
    )
    .test({
      message: "É necessário no mínimo criar uma avaliação",
      test: arr => arr && arr.length > 0,
    })
    .required("Campo obrigatório"),
});
