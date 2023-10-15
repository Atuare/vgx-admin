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

export const trainingStatus = [
  "CONCLUÍDO",
  "EM ANDAMENTO",
  "CANCELADO",
  "SUSPENSO",
];

export const trainingTypesOptions = [
  {
    name: "Pré contratação parcial",
    id: "Pré contratação parcial",
  },
  {
    name: "Pré contratação integral",
    id: "Pré contratação integral",
  },
  {
    name: " Pós contratação",
    id: " Pós contratação",
  },
];
