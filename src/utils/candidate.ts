import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getCandidateById({ id }: { id: string }) {
  const { data: candidateData } = await store.dispatch<any>(
    fetchApi.endpoints.getCandidateById.initiate({ id: id }),
  );

  return candidateData;
}
