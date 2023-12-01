import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getAllProcess(page: number, defaultTableSize: number) {
  const { data: processesData } = await store.dispatch<any>(
    fetchApi.endpoints.getAllProcess.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return processesData;
}
