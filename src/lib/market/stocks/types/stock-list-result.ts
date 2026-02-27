import type { StockListItem } from "./stock-list-item";
import type { StockListPagination } from "./stock-list-pagination";

export type StockListResult = {
  items: StockListItem[];
  pagination: StockListPagination;
};

