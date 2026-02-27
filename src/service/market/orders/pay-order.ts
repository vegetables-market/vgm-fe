import type { PayOrderInput } from "@/lib/market/orders/types/pay-order-input";
import { fetchApi } from "@/lib/api/fetch";
import { mapPayOrderRequest } from "@/service/market/orders/mappers/pay-order-request";

export async function payOrder(
  orderId: number,
  input: PayOrderInput,
): Promise<void> {
  const requestDto = mapPayOrderRequest(input);

  await fetchApi(`/v1/market/orders/${orderId}/pay`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestDto),
  });
}
