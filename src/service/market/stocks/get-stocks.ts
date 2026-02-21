import type { StockListQuery } from "@/lib/market/stocks/types/stock-list-query";
import type { StockListResult } from "@/lib/market/stocks/types/stock-list-result";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import { fetchApi } from "@/lib/api/fetch";
import { mapStockListResult } from "@/service/market/stocks/mappers/stock-list-result";
import type { StockListApiResponse } from "@/service/market/stocks/dto/stock-list-api-response";
import { buildStockListSearchParams } from "./build-search-params";

export async function getStocks(query: StockListQuery): Promise<StockListResult> {
  const params = buildStockListSearchParams(query);
  const raw = await fetchApi<StockListApiResponse>(
    `${API_ENDPOINTS.ITEMS}/search?${params.toString()}`,
    { credentials: "include" },
  );

  return mapStockListResult(raw);
}
