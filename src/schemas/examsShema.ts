import * as yup from "yup";

export const examsCreateSchema = yup.object().shape({
  examiner: yup.string().required("Campo obrigatório"),
  startDate: yup.string().required("Campo obrigatório"),
  endDate: yup.string().required("Campo obrigatório"),
  candidateLimit: yup
    .number()
    .min(1, "Digite um valor igual ou maior que 1")
    .integer("Digite um número inteiro")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  location: yup.string().required("Campo obrigatório"),
  time: yup.string().required("Campo obrigatório"),
});

export const examsEditSchema = yup.object().shape({
  examiner: yup.string().optional(),
  startDate: yup.string().optional(),
  endDate: yup.string().optional(),
  candidateLimit: yup
    .number()
    .min(1, "Digite um valor igual ou maior que 1")
    .integer("Digite um número inteiro")
    .typeError("Número inválido")
    .optional(),
  location: yup.string().optional(),
  time: yup.string().optional(),
});
