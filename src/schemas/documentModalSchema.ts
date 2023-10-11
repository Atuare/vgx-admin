import * as yup from "yup";

export const candidateStatusModalSchema = yup.object().shape({
  status: yup.string().required("Campo obrigatório"),
  reason: yup.string().when("status", {
    is: (status: string) => status !== "APROVADO" && status !== "",
    then: schema => schema.required("Campo obrigatório"),
  }),
});
