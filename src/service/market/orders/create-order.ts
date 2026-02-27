import type { CreateOrderInput } from "@/lib/market/orders/types/create-order-input";
import type { CreateOrderResult } from "@/lib/market/orders/types/create-order-result";
import { fetchApi } from "@/lib/api/fetch";
import type { CreateOrderResponseDto } from "@/service/market/orders/dto/create-order-response-dto";
import { mapCreateOrderRequest } from "@/service/market/orders/mappers/create-order-request";
import { mapCreateOrderResult } from "@/service/market/orders/mappers/create-order-result";

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const requestDto = mapCreateOrderRequest(input);
  const responseDto = await fetchApi<CreateOrderResponseDto>("/v1/market/orders", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestDto),
  });

  return mapCreateOrderResult(responseDto);
}
