import * as yup from "yup";

export const dataModalSchema = yup.object({
  name: yup.string().required("Campo obrigatório"),
  cpf: yup.string().required("Campo obrigatório"),
  gender: yup.string().required("Campo obrigatório"),
  maritalStatus: yup.string().required("Campo obrigatório"),
  birthdate: yup.string().required("Campo obrigatório"),
  state: yup.string().required("Campo obrigatório"),
  city: yup.string().required("Campo obrigatório"),
  whatsapp: yup.string().required("Campo obrigatório"),
  phone: yup.string().required("Campo obrigatório"),
  email: yup.string().email().required("Campo obrigatório"),
  motherName: yup.string().required("Campo obrigatório"),
  fatherName: yup.string().required("Campo obrigatório"),
  childUnderfourteen: yup.boolean().required("Campo obrigatório"),
  childCount: yup
    .number()
    .integer("Número de filhos tem que ser um valor inteiro")
    .required("Campo obrigatório"),
  // TODO: curriculum
  // TODO: address
  complementaryInfo: yup.object().shape({
    hasCellPhone: yup.boolean().required("Campo obrigatório"),
    hasCellPc: yup.boolean().required("Campo obrigatório"),
    hasInternet: yup.boolean().required("Campo obrigatório"),
    weekendObjection: yup.boolean().required("Campo obrigatório"),
    haveDisability: yup.boolean().required("Campo obrigatório"),
    disabilityDescription: yup.string().required("Campo obrigatório"),
    hasMedicalReport: yup.boolean().required("Campo obrigatório"),
    // TODO: medicalReport
    transportVoucher: yup.boolean().required("Campo obrigatório"),
    transportCompany: yup.string().required("Campo obrigatório"),
    transportLine: yup.string().required("Campo obrigatório"),
    transportTaxGoing: yup.string().required("Campo obrigatório"),
    transportTaxReturn: yup.string().required("Campo obrigatório"),
    transportTaxDaily: yup.string().required("Campo obrigatório"),
  }),
  availability: yup.object().required("Campo obrigatório"),
  // TODO: formation
  result: yup.string().required("Campo obrigatório"),
  reason: yup.string().required("Campo obrigatório"),
  observation: yup.string().required("Campo obrigatório"),
  interviewer: yup.string().required("Campo obrigatório"),
});
