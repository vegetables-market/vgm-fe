import type { StockEditDetail } from "@/lib/market/stocks/types/stock-edit-detail";
import type { StockEditDetailApiResponse } from "@/service/market/stocks/dto/stock-edit-detail-api-response";

export function mapStockEditDetail(raw: StockEditDetailApiResponse): StockEditDetail {
  const item = raw.item ?? {};
  const imageUrls = (item.images ?? [])
    .map((image) => image.imageUrl ?? image.image_url ?? "")
    .filter((url) => url.length > 0);

  return {
    itemId: String(item.itemId ?? item.item_id ?? ""),
    name: item.name ?? item.title ?? "",
    description: item.description ?? "",
    imageUrls,
    categoryId: Number(item.categoryId ?? item.category_id ?? 0),
    price: Number(item.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    shippingPayerType: Number(item.shippingPayerType ?? item.shipping_payer_type ?? 0),
    shippingOriginArea: Number(item.shippingOriginArea ?? item.shipping_origin_area ?? 13),
    shippingDaysId: Number(item.shippingDaysId ?? item.shipping_days_id ?? 1),
    shippingMethodId: Number(item.shippingMethodId ?? item.shipping_method_id ?? 1),
    itemCondition: Number(item.itemCondition ?? item.item_condition ?? 0),
  };
}

