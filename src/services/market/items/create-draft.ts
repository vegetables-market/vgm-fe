import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { CreateDraftResponse } from "@/types/market/item";

export const createDraft = async (): Promise<CreateDraftResponse> => {
  const response = await fetchApi<{ itemId?: string; item_id?: string }>(
    `${API_ENDPOINTS.ITEMS}/draft`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const itemId = response.itemId ?? response.item_id;
  if (!itemId) {
    throw new Error("Draft response does not contain itemId");
  }

  return { itemId };
};
