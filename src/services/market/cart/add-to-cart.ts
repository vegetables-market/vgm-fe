import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { AddCartRequest } from "@/types/market/cart";

export const addToCart = async (
  request: AddCartRequest,
): Promise<{ success: boolean; message: string }> => {
  return fetchApi(`${API_ENDPOINTS.CART}`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};
