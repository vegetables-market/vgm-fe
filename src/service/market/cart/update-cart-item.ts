import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { UpdateCartRequest } from "@/types/market/cart";

export const updateCartItem = async (
  cartItemId: number,
  quantity: number,
): Promise<{ success: boolean }> => {
  const request: UpdateCartRequest = { quantity };
  return fetchApi(`${API_ENDPOINTS.CART}/${cartItemId}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
};
