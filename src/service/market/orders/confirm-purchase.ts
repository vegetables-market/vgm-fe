import type { CreateOrderInput } from "@/lib/market/orders/types/create-order-input";
import { createOrder } from "@/service/market/orders/create-order";
import { payOrder } from "@/service/market/orders/pay-order";

export async function confirmPurchase(orderInput: CreateOrderInput): Promise<void> {
  const order = await createOrder(orderInput);
  await payOrder(order.orderId, { paymentMethod: orderInput.paymentMethod });
}
