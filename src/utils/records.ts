import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getAllUnits(page: number, defaultTableSize: number) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllUnits.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}

export async function getAllRoles(page: number, defaultTableSize: number) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllRoles.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}

export async function getAllSkills(page: number, defaultTableSize: number) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllSkills.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}

export async function getAllSalaryClaim(
  page: number,
  defaultTableSize: number,
) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllSalaryClaim.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}

export async function getAllAvailabilities(
  page: number,
  defaultTableSize: number,
) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllAvailabilities.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}

export async function getAllSchoolings(page: number, defaultTableSize: number) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllSchoolings.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}
