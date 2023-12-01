import * as yup from "yup";

export const unitModalConfigSchema = yup
  .object({
    unitAcronym: yup.string().required("Campo obrigatório"),
    unitName: yup.string().required("Campo obrigatório"),
    unitAddress: yup.string().required("Campo obrigatório"),
  })
  .required();

export const roleModalConfigSchema = yup
  .object({
    roleText: yup.string().required("Campo obrigatório"),
    roleDescription: yup.string().required("Campo obrigatório"),
  })
  .required();

export const skillModalConfigSchema = yup
  .object({
    skillText: yup.string().required("Campo obrigatório"),
  })
  .required();

export const salaryClaimModalConfigSchema = yup
  .object({
    fromAmount: yup
      .number()
      .typeError("Número inválido")
      .min(1, "O valor inicial tem que ser maior ou igual a 1")
      .max(
        9999999.99,
        "O valor inicial tem que ser menor ou igual a 9999999.99",
      )
      .max(
        yup.ref("toAmount"),
        "O valor inicial não pode ser maior que o final",
      )
      .required("Campo obrigatório"),
    toAmount: yup
      .number()
      .typeError("Número inválido")
      .min(1, "O valor inicial tem que ser maior ou igual a 1")
      .max(
        9999999.99,
        "O valor inicial tem que ser menor ou igual a 9999999.99",
      )
      .required("Campo obrigatório"),
  })
  .required();

export const availabilityModalConfigSchema = yup
  .object({
    startDay: yup.string().required("Campo obrigatório"),
    endDay: yup.string().required("Campo obrigatório"),
    startHour: yup.string().required("Campo obrigatório"),
    endHour: yup.string().required("Campo obrigatório"),
  })
  .required();

export const schoolingModalConfigSchema = yup
  .object({
    schoolingName: yup.string().required("Campo obrigatório"),
    informCourse: yup.boolean(),
  })
  .required();
