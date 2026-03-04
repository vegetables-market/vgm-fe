import type { ConfirmPurchaseInput } from "@/lib/market/checkout/types/confirm-purchase-input";
import { fetchApi } from "@/lib/api/fetch";

type CheckoutCreateRequestDto = {
  items: Array<{
    item_id: string;
    quantity: number;
  }>;
  shipping: {
    name: string;
    zip_code: string;
    prefecture: string;
    city: string;
    address_line1: string;
    address_line2: string | null;
  };
  payment_method: string;
};

type CheckoutCreateResponseDto = {
  orderId: number;
  status: string;
  totalAmount: number;
  paymentIntentId?: string;
  clientSecret?: string;
};

type CheckoutPayRequestDto = {
  payment_method: string;
  payment_intent_id?: string;
};

export type CheckoutStartResult = {
  orderId: number;
  status: string;
  totalAmount: number;
  paymentIntentId?: string;
  clientSecret?: string;
};

type CheckoutPayInput = {
  paymentMethod: string;
  paymentIntentId?: string;
};

export async function startCheckout(orderInput: ConfirmPurchaseInput): Promise<CheckoutStartResult> {
  const requestDto: CheckoutCreateRequestDto = {
    items: [
      {
        item_id: orderInput.itemId,
        quantity: orderInput.quantity,
      },
    ],
    shipping: {
      name: orderInput.shippingName,
      zip_code: orderInput.shippingZipCode,
      prefecture: orderInput.shippingPrefecture,
      city: orderInput.shippingCity,
      address_line1: orderInput.shippingAddressLine1,
      address_line2: orderInput.shippingAddressLine2,
    },
    payment_method: orderInput.paymentMethod,
  };

  const order = await fetchApi<CheckoutCreateResponseDto>("/v1/market/checkout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestDto),
  });

  return {
    orderId: order.orderId,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    paymentIntentId: order.paymentIntentId,
    clientSecret: order.clientSecret,
  };
}

export async function completeCheckoutPayment(
  orderId: number,
  input: CheckoutPayInput,
): Promise<void> {
  const payRequestDto: CheckoutPayRequestDto = {
    payment_method: input.paymentMethod,
    payment_intent_id: input.paymentIntentId,
  };

  await fetchApi(`/v1/market/checkout/${orderId}/pay`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payRequestDto),
  });
}
