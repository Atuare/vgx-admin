import { z } from "zod";

const phoneRegex = /^[0-9]{13}$/;

export const editProfileSchema = z
  .object({
    phone: z
      .string()
      .regex(phoneRegex, { message: "Número de telefone inválido" })
      .optional(),
    whatsapp: z
      .string()
      .regex(phoneRegex, { message: "Número de whatsapp inválido" })
      .optional(),
    emailPersonal: z.string().email({ message: "Email inválido" }).optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    currentPassword: z
      .string()
      .min(6, { message: "A senha precisa ter no mínimo 6 caracteres" })
      .optional(),
    newPassword: z
      .string()
      .min(6, { message: "A nova senha precisa ter no mínimo 6 caracteres" })
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    data => data.newPassword === data.confirmPassword,

    {
      path: ["newPassword"],
      message: "As senhas não coincidem",
    },
  )
  .refine(
    data => data.newPassword === data.confirmPassword,

    {
      path: ["confirmPassword"],
      message: "As senhas não coincidem",
    },
  )
  .refine(
    data => {
      // Verifique se currentPassword é vazio apenas se newPassword ou confirmPassword estiverem preenchidos
      if ((data.newPassword || data.confirmPassword) && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      path: ["currentPassword"],
      message: "A senha atual é obrigatória",
    },
  )
  .refine(
    data => {
      // Verifique se newPassword é vazio apenas se currentPassword ou confirmPassword estiver preenchido
      if ((data.currentPassword || data.confirmPassword) && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      path: ["newPassword"],
      message: "A nova senha é obrigatória",
    },
  );
