import type { StockFormInput } from "@/lib/market/stocks/types/stock-form-input";
import type { EditStockRequestDto } from "@/service/market/stocks/dto/edit-stock-request-dto";

export function buildEditStockRequest(input: StockFormInput): EditStockRequestDto {
  return {
    name: input.name,
    description: input.description,
    categoryId: Number(input.categoryId),
    price: Number(input.price),
    quantity: Number(input.quantity),
    shippingPayerType: input.shippingPayerType,
    shippingOriginArea: input.prefectureId,
    shippingDaysId: input.shippingDaysId,
    shippingMethodId: input.shippingMethodId,
    itemCondition: input.itemCondition,
    imageUrls: input.imageUrls,
  };
}

