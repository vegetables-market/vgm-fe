import type { MyStockItem } from "@/lib/market/stocks/types/my-stock-item";
import type { StockItemRaw } from "@/service/market/stocks/dto/stock-item-raw";

export function mapMyStockItem(raw: StockItemRaw): MyStockItem {
  return {
    itemId: String(raw.id ?? raw.itemId ?? raw.item_id ?? 0),
    name: raw.name ?? raw.title ?? "",
    price: Number(raw.price ?? 0),
    status: Number(raw.status ?? 0),
    imageUrl: raw.imageUrl ?? raw.image_url ?? null,
    createdAt: raw.createdAt ?? raw.created_at ?? "",
  };
}

