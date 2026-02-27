import type { StockListSort } from "@/lib/market/stocks/types/stock-list-sort";

const STOCK_LIST_SORTS: StockListSort[] = ["newest", "price_asc", "price_desc", "popular"];

export function normalizeStockListSort(value: string | null | undefined): StockListSort {
  if (!value) return "newest";
  if (STOCK_LIST_SORTS.includes(value as StockListSort)) return value as StockListSort;
  return "newest";
}

