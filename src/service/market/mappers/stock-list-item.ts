import type { StockListItem } from "@/lib/market/types/stock-list-item";
import type { StockItemRaw } from "@/service/market/providers/vgm/dto/stock-item-raw";
import { mapStockSeller } from "./stock-seller";

export function mapStockListItem(raw: StockItemRaw): StockListItem {
  return {
    itemId: String(raw.itemId ?? raw.item_id ?? ""),
    title: raw.title ?? raw.name ?? "",
    description: raw.description ?? null,
    price: Number(raw.price ?? 0),
    categoryId: raw.categoryId ?? raw.category_id ?? null,
    categoryName: raw.categoryName ?? raw.category_name ?? null,
    condition: Number(raw.condition ?? 0),
    status: Number(raw.status ?? 0),
    likesCount: Number(raw.likesCount ?? raw.likes_count ?? 0),
    thumbnailUrl: raw.thumbnailUrl ?? raw.thumbnail_url ?? null,
    imageUrl: raw.imageUrl ?? raw.image_url ?? null,
    seller: mapStockSeller(raw.seller),
    createdAt: raw.createdAt ?? raw.created_at ?? "",
  };
}

