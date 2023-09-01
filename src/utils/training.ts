import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getAllTrainings(page: number, defaultTableSize: number) {
  const { data: trainingsData } = await store.dispatch<any>(
    fetchApi.endpoints.getAllTrainings.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return trainingsData;
}
