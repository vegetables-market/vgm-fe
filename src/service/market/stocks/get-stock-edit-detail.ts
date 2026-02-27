import type { StockEditDetail } from "@/lib/market/stocks/types/stock-edit-detail";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import { fetchApi } from "@/lib/api/fetch";
import type { StockEditDetailApiResponse } from "@/service/market/stocks/dto/stock-edit-detail-api-response";
import { mapStockEditDetail } from "@/service/market/stocks/mappers/stock-edit-detail";

export async function getStockEditDetail(itemId: string): Promise<StockEditDetail> {
  const raw = await fetchApi<StockEditDetailApiResponse>(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
    credentials: "include",
  });

  return mapStockEditDetail(raw);
}

