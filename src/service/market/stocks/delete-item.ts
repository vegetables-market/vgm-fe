import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";

export const deleteItem = async (itemId: string): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
    method: "DELETE",
  });
};
