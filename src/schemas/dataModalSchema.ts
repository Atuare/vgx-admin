import * as yup from "yup";

export const dataModalSchema = yup.object({
  name: yup.string().required("Campo obrigatório"),
  cpf: yup.string().min(14, "CPF inválido").required("Campo obrigatório"),
  gender: yup.string().required("Campo obrigatório"),
  civilStatus: yup.string().required("Campo obrigatório"),
  birthdate: yup.string().required("Campo obrigatório"),
  state: yup.string().required("Campo obrigatório"),
  county: yup.string().required("Campo obrigatório"),
  whatsapp: yup
    .string()
    .min(17, "Whatsapp inválido")
    .required("Campo obrigatório"),
  phone: yup
    .string()
    .min(17, "Telefone inválido")
    .required("Campo obrigatório"),
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  motherName: yup.string().required("Campo obrigatório"),
  fatherName: yup.string().required("Campo obrigatório"),
  childUnderfourteen: yup.boolean().required("Campo obrigatório"),
  childCount: yup
    .number()
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  // // TODO: curriculum
  address: yup.object().shape({
    zipCode: yup.string().min(9, "CEP inválido").required("Campo obrigatório"),
    address: yup.string().required("Campo obrigatório"),
    neighborhood: yup.string().required("Campo obrigatório"),
    number: yup.string().required("Campo obrigatório"),
    complement: yup.string().required("Campo obrigatório"),
    state: yup.string().required("Campo obrigatório"),
  }),
  complementaryInfo: yup.object().shape({
    hasCellPhone: yup.boolean().required("Campo obrigatório"),
    hasCellPc: yup.boolean().required("Campo obrigatório"),
    hasInternet: yup.boolean().required("Campo obrigatório"),
    weekendObjection: yup.boolean().required("Campo obrigatório"),
    haveDisability: yup.boolean().required("Campo obrigatório"),
    disabilityDescription: yup.string().when("haveDisability", {
      is: true,
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
    hasMedicalReport: yup.boolean().required("Campo obrigatório"),
    // TODO: medicalReport
    transportVoucher: yup.boolean().required("Campo obrigatório"),
    transportCompany: yup.string().when("transportVoucher", {
      is: true,
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
    transportLine: yup.string().when("transportVoucher", {
      is: true,
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
    transportTaxGoing: yup.string().when("transportVoucher", {
      is: true,
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
    transportTaxReturn: yup.string().when("transportVoucher", {
      is: true,
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
    transportTaxDaily: yup.string().when("transportVoucher", {
      is: true,
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
  }),
  availability: yup.string().required("Campo obrigatório"),
  formation: yup.object().shape({
    type: yup
      .mixed()
      .oneOf(["BASICA", "TECNICA", "SUPERIOR"])
      .required("Campo obrigatório"),
    course: yup.string().required("Campo obrigatório"),
    status: yup
      .mixed()
      .oneOf(["COMPLETO", "EMANDAMENTO", "SUSPENSO"])
      .required("Campo obrigatório"),
    period: yup
      .mixed()
      .oneOf(["MATUTINO", "VESPERTINO", "NOTURNO"])
      .required("Campo obrigatório"),
  }),

  documents: yup.object().shape({
    identity: yup.object().shape({
      rg: yup.string().min(9, "RG inválido").required("Campo obrigatório"),
      identityShippingDate: yup.string().required("Campo obrigatório"),
      federalUnit: yup.string().required("Campo obrigatório"),
      uf: yup.string().required("Campo obrigatório"),
    }),
    work: yup.object().shape({
      ctps: yup.string().min(11, "CTPS inválido").required("Campo obrigatório"),
      pis: yup.string().min(11, "PIS inválido").required("Campo obrigatório"),
      shippingDate: yup.string().required("Campo obrigatório"),
      serie: yup.string().required("Campo obrigatório"),
      uf: yup.string().required("Campo obrigatório"),
    }),
    bank: yup.object().shape({
      bank: yup.string().required("Campo obrigatório"),
      agency: yup
        .string()
        .min(4, "Agência inválida")
        .required("Campo obrigatório"),
      account: yup
        .string()
        .min(8, "Conta inválida")
        .required("Campo obrigatório"),
      pixKeyType: yup.string().required("Campo obrigatório"),
      pixKey: yup
        .string()
        .when("pixKeyType", {
          is: (value: string) => value === "CPF",
          then: (schema: any) =>
            schema.min(11, "CPF inválido").required("Campo obrigatório"),
        })
        .when("pixKeyType", {
          is: (value: string) => value === "Telefone",
          then: (schema: any) =>
            schema.min(17, "Telefone inválido").required("Campo obrigatório"),
        })
        .when("pixKeyType", {
          is: (value: string) => value === "E-mail",
          then: (schema: any) =>
            schema.email("Email inválido").required("Campo obrigatório"),
        })
        .when("pixKeyType", {
          is: (value: string) => value === "Chave aleatória",
          then: (schema: any) =>
            schema
              .min(32, "Chave aleatória inválida")
              .required("Campo obrigatório"),
        })
        .required("Campo obrigatório"),
    }),
  }),

  results: yup.object().shape({
    result: yup.string().required("Campo obrigatório"),
    reason: yup.string().when("result", {
      is: (value: string) => value === "REPROVADO",
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
    training: yup.string().when("result", {
      is: (value: string) => value === "APROVADO",
      then: (schema: any) => schema.required("Campo obrigatório"),
    }),
    observation: yup.string().required("Campo obrigatório"),
  }),
});
