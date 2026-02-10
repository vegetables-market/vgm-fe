import { fetchApi } from "../../lib/api/client";

export const getOrder = async (orderId: number): Promise<any> => {
  return fetchApi(`/api/orders/${orderId}`, { method: "GET" });
};
