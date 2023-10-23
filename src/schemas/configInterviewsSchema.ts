import * as yup from "yup";

export const GeneralSchema = yup
  .object({
    unitOrSite: yup
      .object({
        name: yup.string().required("Campo obrigatório"),
        id: yup.string().required("Campo obrigatório"),
      })
      .required("Campo obrigatório"),
    type: yup
      .object({
        name: yup.string().required("Campo obrigatório"),
        id: yup.string().required("Campo obrigatório"),
      })
      .required("Campo obrigatório"),
    limitTime: yup.string().required("Campo obrigatório"),
    startDate: yup.string().required("Campo obrigatório"),
    availableDays: yup
      .number()
      .typeError("Número inválido")
      .integer("Número inválido")
      .min(1, "Digite um número maior que 0")
      .required("Campo obrigatório"),
    endMessage: yup.string().required("Campo obrigatório"),
  })
  .required("Campo obrigatório");

export const SchedulingModalSchema = yup.object({
  date: yup.string().required("Campo obrigatório"),
  schedulingLimit: yup
    .number()
    .typeError("Número inválido")
    .integer("Número inválido")
    .min(1, "Digite um número maior que 0")
    .required("Campo obrigatório"),
  dayOfWeek: yup.string().required("Campo obrigatório"),
});

export const SchedulingsSchema = yup.object({
  schedulings: yup.array().test({
    message: "É necessário criar pelo menos um horário",
    test: arr => arr && arr.length > 0,
  }),
});

export const DatesModalSchema = yup.object({
  date: yup.string().required("Campo obrigatório"),
  description: yup.string().required("Campo obrigatório"),
});

export const DatesSchema = yup.object({
  dates: yup.array().test({
    message: "É necessário criar pelo menos uma data indisponível",
    test: arr => arr && arr.length > 0,
  }),
});
