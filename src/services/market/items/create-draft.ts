import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { CreateDraftResponse } from "@/types/market/item";

export const createDraft = async (): Promise<CreateDraftResponse> => {
  return fetchApi<CreateDraftResponse>(`${API_ENDPOINTS.ITEMS}/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
