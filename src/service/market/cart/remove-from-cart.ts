import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";

export const removeFromCart = async (
  cartItemId: number,
): Promise<{ success: boolean }> => {
  return fetchApi(`${API_ENDPOINTS.CART}/${cartItemId}`, {
    method: "DELETE",
  });
};
