import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getAllAdmissions(page: number, defaultTableSize: number) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllAdmissions.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}

export async function getAdmissionById(
  admissionId: string,
  page: number,
  size: number,
) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAdmission.initiate({
      admissionId,
      page,
      size,
    }),
  );

  return data;
}

export const admissionsStatus = ["Assinado", "Não Assinado", "Pendente"];
