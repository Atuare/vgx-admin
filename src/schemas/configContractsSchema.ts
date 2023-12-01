import * as yup from "yup";

export const contractConfigModalConfigSchema = yup
  .object({
    name: yup.string().required("Campo obrigatório"),
    description: yup.string().required("Campo obrigatório"),
    document: yup.string().required("Campo obrigatório"),
    transportVoucher: yup.boolean(),
    hasChilds: yup.boolean(),
  })
  .required();
