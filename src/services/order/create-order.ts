import { fetchApi } from "@/lib/api/fetch";
import type { CreateOrderRequest, CreateOrderResponse } from "@/types/order";

export const createOrder = async (
  orderData: CreateOrderRequest,
): Promise<CreateOrderResponse> => {
  return fetchApi<CreateOrderResponse>("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
};
