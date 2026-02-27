import type { StockDetail } from "@/lib/market/stocks/types/stock-detail";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import { fetchApi } from "@/lib/api/fetch";
import type { StockDetailApiResponse } from "@/service/market/stocks/dto/stock-detail-api-response";
import { mapStockDetail } from "@/service/market/stocks/mappers/stock-detail";

export async function getStockDetail(itemId: string | number): Promise<StockDetail> {
  const raw = await fetchApi<StockDetailApiResponse>(
    `${API_ENDPOINTS.ITEMS}/${itemId}`,
    { credentials: "include" },
  );

  return mapStockDetail(raw);
}
