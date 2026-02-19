import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { Item } from "@/types/market/item";

export const getMyItems = async (): Promise<Item[]> => {
  return fetchApi<Item[]>(`${API_ENDPOINTS.ITEMS}/me`, {
    method: "GET",
  });
};
