import type { StockDetail } from "@/lib/market/stocks/types/stock-detail";
import type { StockDetailApiResponse } from "@/service/market/stocks/dto/stock-detail-api-response";

export function mapStockDetail(raw: StockDetailApiResponse): StockDetail {
  const rawItem = raw.item ?? {};
  const rawRelatedItems = raw.relatedItems ?? raw.related_items ?? [];

  return {
    item: {
      itemId: Number(rawItem.itemId ?? rawItem.item_id ?? 0),
      title: rawItem.title ?? "",
      description: rawItem.description ?? null,
      price: Number(rawItem.price ?? 0),
      quantity: Number(rawItem.quantity ?? 0),
      categoryId: rawItem.categoryId ?? rawItem.category_id ?? null,
      categoryName: rawItem.categoryName ?? rawItem.category_name ?? null,
      condition: Number(rawItem.condition ?? 0),
      status: Number(rawItem.status ?? 0),
      likesCount: Number(rawItem.likesCount ?? rawItem.likes_count ?? 0),
      isLiked: Boolean(rawItem.isLiked ?? rawItem.is_liked ?? false),
      brand: rawItem.brand ?? null,
      weight: rawItem.weight ?? null,
      shippingPayerType: Number(
        rawItem.shippingPayerType ?? rawItem.shipping_payer_type ?? 0,
      ),
      images: (rawItem.images ?? []).map((image) => ({
        imageId: Number(image.imageId ?? image.image_id ?? 0),
        imageUrl: image.imageUrl ?? image.image_url ?? "",
        displayOrder: Number(image.displayOrder ?? image.display_order ?? 0),
      })),
      seller: {
        userId: Number(rawItem.seller?.userId ?? rawItem.seller?.user_id ?? 0),
        username: rawItem.seller?.username ?? "",
        displayName:
          rawItem.seller?.displayName ?? rawItem.seller?.display_name ?? "",
        avatarUrl: rawItem.seller?.avatarUrl ?? rawItem.seller?.avatar_url ?? null,
        ratingAverage:
          rawItem.seller?.ratingAverage ?? rawItem.seller?.rating_average ?? null,
        ratingCount: Number(
          rawItem.seller?.ratingCount ?? rawItem.seller?.rating_count ?? 0,
        ),
      },
      createdAt: rawItem.createdAt ?? rawItem.created_at ?? "",
      updatedAt: rawItem.updatedAt ?? rawItem.updated_at ?? "",
    },
    relatedItems: rawRelatedItems.map((relatedItem) => ({
      itemId: Number(relatedItem.itemId ?? relatedItem.item_id ?? 0),
      title: relatedItem.title ?? "",
      price: Number(relatedItem.price ?? 0),
      thumbnailUrl: relatedItem.thumbnailUrl ?? relatedItem.thumbnail_url ?? null,
    })),
  };
}
