import type { CreateOrderResult } from "@/lib/market/orders/types/create-order-result";
import type { CreateOrderResponseDto } from "@/service/market/orders/dto/create-order-response-dto";

export function mapCreateOrderResult(dto: CreateOrderResponseDto): CreateOrderResult {
  return {
    orderId: Number(dto.orderId),
    totalAmount: Number(dto.totalAmount),
    status: Number(dto.status),
  };
}
