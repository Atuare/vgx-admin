import * as yup from "yup";

export const documentConfigModalConfigSchema = yup
  .object({
    name: yup.string().required("Campo obrigatório"),
    mandatory: yup.boolean(),
    man: yup.boolean(),
    eighteenYears: yup.boolean(),
    married: yup.boolean(),
    childrens: yup.boolean(),
  })
  .required();
