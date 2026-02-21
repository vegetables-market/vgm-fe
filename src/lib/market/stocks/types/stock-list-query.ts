import type { StockListSort } from "./stock-list-sort";

export type StockListQuery = {
  keyword?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: StockListSort;
  page?: number;
  limit?: number;
};

