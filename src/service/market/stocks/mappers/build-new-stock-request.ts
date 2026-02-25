import type { StockFormInput } from "@/lib/market/stocks/types/stock-form-input";
import type { NewStockRequestDto } from "@/service/market/stocks/dto/new-stock-request-dto";

export function buildNewStockRequest(input: StockFormInput): NewStockRequestDto {
  return {
    name: input.name,
    description: input.description,
    category_id: Number(input.categoryId),
    price: Number(input.price),
    quantity: Number(input.quantity),
    shipping_payer_type: input.shippingPayerType,
    shipping_origin_area: input.prefectureId,
    shipping_days_id: input.shippingDaysId,
    shipping_method_id: input.shippingMethodId,
    item_condition: input.itemCondition,
  };
}

