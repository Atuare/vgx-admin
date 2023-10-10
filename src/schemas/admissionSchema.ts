import * as yup from "yup";

export const createAdmissionsSchema = yup.object().shape({
  unit: yup.string().required("Campo obrigatório"),
  product: yup.string().required("Campo obrigatório"),
  admissionDate: yup.string().required("Campo obrigatório"),
  limit: yup
    .number()
    .min(1, "Digite um valor maior ou igual a 1")
    .required("Campo obrigatório"),
  candidateIds: yup
    .array()
    .test({
      message: "É necessário no mínimo selecionar um candidato",
      test: arr => arr && arr.length > 0,
    })
    .required("É necessário no mínimo selecionar um candidato"),
});
