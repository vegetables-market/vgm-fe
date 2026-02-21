import type { StockSeller } from "@/lib/market/stocks/types/stock-seller";
import type { StockSellerRaw } from "@/service/market/stocks/dto/stock-seller-raw";

export function mapStockSeller(raw?: StockSellerRaw): StockSeller {
  return {
    userId: Number(raw?.userId ?? raw?.user_id ?? 0),
    username: raw?.username ?? "",
    displayName: raw?.displayName ?? raw?.display_name ?? "",
    avatarUrl: raw?.avatarUrl ?? raw?.avatar_url ?? null,
  };
}

