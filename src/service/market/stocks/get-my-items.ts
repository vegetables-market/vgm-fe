import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { StockItemRaw } from "./dto/stock-item-raw";

export const getMyItems = async (): Promise<StockItemRaw[]> => {
  return fetchApi<StockItemRaw[]>(`${API_ENDPOINTS.ITEMS}/me`, {
    method: "GET",
  });
};
