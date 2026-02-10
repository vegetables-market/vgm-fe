import { fetchApi } from "../../lib/api/client";

export const getOrders = async (buyerId: number): Promise<any[]> => {
  return fetchApi(`/api/orders?buyerId=${buyerId}`, { method: "GET" });
};
