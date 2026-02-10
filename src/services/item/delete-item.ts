import { fetchApi } from "../../lib/api/client";
import { API_ENDPOINTS } from "../../lib/api/client";

export const deleteItem = async (itemId: number): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
    method: "DELETE",
  });
};
