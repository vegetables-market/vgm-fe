import type { StockListResult } from "@/lib/market/types/stock-list-result";
import type { StockListApiResponse } from "@/service/market/providers/vgm/dto/stock-list-api-response";
import { mapStockListItem } from "./stock-list-item";
import { mapStockListPagination } from "./stock-list-pagination";

export function mapStockListResult(raw: StockListApiResponse): StockListResult {
  return {
    items: (raw.items ?? []).map(mapStockListItem),
    pagination: mapStockListPagination(raw.pagination),
  };
}

