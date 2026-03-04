import type { PaymentMethod } from "@/lib/types";

export function resolvePaymentMethod(payment: PaymentMethod): string {
  if (payment.type === "credit_card") {
    return "card";
  }

  return payment.type;
}
