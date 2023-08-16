import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .email("Email inválido")
    .required("Email é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});
