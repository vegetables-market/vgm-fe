import { fetchApi } from "../../lib/api/client";
import { API_ENDPOINTS } from "../../lib/api/client";
import type { CreateDraftResponse } from "../../types";

export const createDraft = async (): Promise<CreateDraftResponse> => {
  return fetchApi<CreateDraftResponse>(`${API_ENDPOINTS.ITEMS}/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
