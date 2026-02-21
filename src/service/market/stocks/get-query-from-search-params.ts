import type { StockListQuery } from "@/lib/market/stocks/types/stock-list-query";
import { normalizeStockListSort } from "./normalize-sort";

export function getStockListQueryFromSearchParams(searchParams: URLSearchParams): StockListQuery {
  const rawPage = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  return {
    keyword: searchParams.get("q") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sort: normalizeStockListSort(searchParams.get("sort")),
    page,
    limit: 20,
  };
}
