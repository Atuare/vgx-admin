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

export async function getAdmissionById(id: string) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAdmissionById.initiate({
      id: id,
    }),
  );

  return data;
}
