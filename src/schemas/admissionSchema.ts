import * as yup from "yup";

export const createAdmissionsSchema = yup.object().shape({
  unit: yup.string().required("Campo obrigatório"),
  product: yup.string().required("Campo obrigatório"),
  date: yup
    .date()
    .typeError("Data inválida")
    .min(new Date(), "Data não pode ser igual a data atual")
    .required("Campo obrigatório"),
  limitCandidates: yup
    .number()
    .typeError("Número inválido")
    .min(1, "Digite um valor maior ou igual a 1")
    .required("Campo obrigatório"),
  candidacysIds: yup
    .array()
    .test({
      message: "É necessário no mínimo selecionar um candidato",
      test: arr => arr && arr.length > 0,
    })
    .required("É necessário no mínimo selecionar um candidato"),
});
