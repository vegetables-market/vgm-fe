import type { StockListPagination } from "@/lib/market/types/stock-list-pagination";
import type { StockListPaginationRaw } from "@/service/market/providers/vgm/dto/stock-list-pagination-raw";

export function mapStockListPagination(
  raw?: StockListPaginationRaw,
): StockListPagination {
  return {
    page: raw?.page ?? 1,
    limit: raw?.limit ?? 20,
    total: raw?.total ?? 0,
    totalPages: raw?.totalPages ?? raw?.total_pages ?? 0,
  };
}

