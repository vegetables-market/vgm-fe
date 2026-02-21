import type { StockItemRaw } from "./stock-item-raw";
import type { StockListPaginationRaw } from "./stock-list-pagination-raw";

export type StockListApiResponse = {
  items?: StockItemRaw[];
  pagination?: StockListPaginationRaw;
};

