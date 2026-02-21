import type { PayOrderInput } from "@/lib/market/orders/types/pay-order-input";
import type { PayOrderRequestDto } from "@/service/market/orders/dto/pay-order-request-dto";

export function mapPayOrderRequest(input: PayOrderInput): PayOrderRequestDto {
  return {
    paymentMethod: input.paymentMethod,
  };
}
