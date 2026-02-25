import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { MyStockItem } from "@/lib/market/stocks/types/my-stock-item";
import type { StockItemRaw } from "./dto/stock-item-raw";
import { mapMyStockItem } from "./mappers/my-stock-item";

export const getMyItems = async (): Promise<MyStockItem[]> => {
  const rawItems = await fetchApi<StockItemRaw[]>(`${API_ENDPOINTS.ITEMS}/me`, {
    method: "GET",
  });

  return rawItems.map(mapMyStockItem);
};
