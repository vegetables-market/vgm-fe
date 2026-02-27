import type { StockListResult } from "@/lib/market/stocks/types/stock-list-result";
import type { StockListApiResponse } from "@/service/market/stocks/dto/stock-list-api-response";
import { mapStockListItem } from "./stock-list-item";
import { mapStockListPagination } from "./stock-list-pagination";

export function mapStockListResult(raw: StockListApiResponse): StockListResult {
  return {
    items: (raw.items ?? []).map(mapStockListItem),
    pagination: mapStockListPagination(raw.pagination),
  };
}

