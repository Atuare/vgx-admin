import { isAfterYesterday } from "@/utils/dates";
import * as yup from "yup";

export const processEditStepOneSchema = yup.object({
  unit: yup.object().optional(),
  role: yup.object().optional(),
  requestCv: yup.boolean().optional(),
  startDate: yup
    .date()
    .test(
      "isAfterYesterday",
      "A data deve ser maior que um dia atrás.",
      isAfterYesterday,
    )
    .max(yup.ref("endDate"), "A data inicial deve ser menor que a final")
    .optional(),
  endDate: yup.date().optional(),
  limitCandidates: yup.number().optional(),
  banner: yup
    .mixed()
    .test(
      "fileFormat",
      "O banner deve ser uma imagem PNG, JPG ou JPEG",
      (file: File | any) => {
        if (!file) return true; // Permite valores vazios

        const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
        return allowedFormats.includes(file?.type);
      },
    )
    .test("fileSize", "O banner deve ter no máximo 5MB", (file: File | any) => {
      if (!file) return true; // Permite valores vazios

      const maxSize = 5 * 1024 * 1024; // 5MB
      return file?.size <= maxSize;
    })
    .optional(),
  observations: yup.string().optional(),
  registrationCompletionMessage: yup.string().optional(),
});

export const processEditStepTwoSchema = yup.object().shape({
  type: yup.string().optional(),
  skills: yup.array().optional(),
  availabilities: yup.array().optional(),
  schoolings: yup.array().optional(),
  benefits: yup.array().optional(),
  availableForMinors: yup.boolean().optional(),
});
