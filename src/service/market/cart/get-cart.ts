import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { CartResponse } from "@/types/market/cart";

export const getCart = async (): Promise<CartResponse> => {
  return fetchApi<CartResponse>(API_ENDPOINTS.CART);
};
