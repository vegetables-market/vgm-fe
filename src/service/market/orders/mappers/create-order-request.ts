import type { CreateOrderInput } from "@/lib/market/orders/types/create-order-input";
import type { CreateOrderRequestDto } from "@/service/market/orders/dto/create-order-request-dto";

export function mapCreateOrderRequest(input: CreateOrderInput): CreateOrderRequestDto {
  return {
    itemId: input.itemId,
    quantity: input.quantity,
    shippingName: input.shippingName,
    shippingZipCode: input.shippingZipCode,
    shippingPrefecture: input.shippingPrefecture,
    shippingCity: input.shippingCity,
    shippingAddressLine1: input.shippingAddressLine1,
    shippingAddressLine2: input.shippingAddressLine2,
    paymentMethod: input.paymentMethod,
  };
}
