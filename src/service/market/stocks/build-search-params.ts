import type { StockListQuery } from "@/lib/market/stocks/types/stock-list-query";

export function buildStockListSearchParams(query: StockListQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.keyword) params.set("q", query.keyword);
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.minPrice) params.set("minPrice", query.minPrice);
  if (query.maxPrice) params.set("maxPrice", query.maxPrice);
  if (query.sort) params.set("sort", query.sort);

  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 20));

  return params;
}

