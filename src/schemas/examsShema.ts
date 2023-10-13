import * as yup from "yup";

export const examsCreateSchema = yup.object().shape({
  examiner: yup.string().required("Campo obrigatório"),
  startDate: yup.string().required("Campo obrigatório"),
  endDate: yup.string().required("Campo obrigatório"),
  limit: yup
    .number()
    .min(1, "Digite um valor igual ou maior que 1")
    .integer("Digite um número inteiro")
    .typeError("Número inválido")
    .required("Campo obrigatório"),
  local: yup.string().required("Campo obrigatório"),
  hour: yup.string().required("Campo obrigatório"),
});
