import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getSignatureDocument(id: string) {
  const { data: signatureDocumentData } = await store.dispatch<any>(
    fetchApi.endpoints.getSignatureDocument.initiate({
      id,
    }),
  );

  return signatureDocumentData;
}
