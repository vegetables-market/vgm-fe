import { fetchApi } from "@/lib/api/fetch";

export const getPaymentIntent = async (orderId: number): Promise<any> => {
  return fetchApi(`/api/payment/intent/${orderId}`, { method: "GET" });
};
