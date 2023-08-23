import * as yup from "yup";

const phoneRegex = /^\d{13}$/;

export const editProfileSchema = yup
  .object({
    phone: yup
      .string()
      .matches(phoneRegex, "Número de telefone inválido")
      .optional(),
    whatsapp: yup
      .string()
      .matches(phoneRegex, "Número de whatsapp inválido")
      .optional(),
    emailPersonal: yup.string().email("Email inválido").optional(),
    linkedin: yup.string().optional(),
    facebook: yup.string().optional(),
    instagram: yup.string().optional(),
    currentPassword: yup.string().optional(),
    newPassword: yup.string().optional(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "As novas senhas não coincidem")
      .optional(),
  })
  .required();
