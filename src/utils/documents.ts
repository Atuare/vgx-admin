import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getAllDocuments(page: number, defaultTableSize: number) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllDocuments.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}
