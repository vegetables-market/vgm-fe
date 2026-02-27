import type { StockFormInput } from "@/lib/market/stocks/types/stock-form-input";
import type { NewStockRequestDto } from "@/service/market/stocks/dto/new-stock-request-dto";

export function buildNewStockRequest(input: StockFormInput): NewStockRequestDto {
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

