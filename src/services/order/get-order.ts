import { fetchApi } from "@/lib/api/fetch";

export const getOrder = async (orderId: number): Promise<any> => {
  return fetchApi(`/api/orders/${orderId}`, { method: "GET" });
};
