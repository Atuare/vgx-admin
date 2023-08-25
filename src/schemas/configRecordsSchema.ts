import * as yup from "yup";

export const unitModalConfigSchema = yup
  .object({
    unitAcronym: yup.string().required("Campo obrigatório"),
    unitName: yup.string().required("Campo obrigatório"),
    unitDescription: yup.string().required("Campo obrigatório"),
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
    fromAmount: yup.number().required("Campo obrigatório"),
    toAmount: yup.number().required("Campo obrigatório"),
  })
  .required();

export const availabilityModalConfigSchema = yup
  .object({
    availabilityText: yup.string().required("Campo obrigatório"),
  })
  .required();

export const schoolingModalConfigSchema = yup
  .object({
    schoolingName: yup.string().required("Campo obrigatório"),
    informCourse: yup.boolean(),
  })
  .required();
