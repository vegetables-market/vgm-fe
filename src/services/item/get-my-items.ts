import { fetchApi } from "../../lib/api/client";
import { API_ENDPOINTS } from "../../lib/api/client";
import type { Item } from "../../types";

export const getMyItems = async (): Promise<Item[]> => {
  return fetchApi<Item[]>(`${API_ENDPOINTS.ITEMS}/me`, {
    method: "GET",
  });
};
