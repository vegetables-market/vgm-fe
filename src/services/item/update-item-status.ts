import { fetchApi } from "../../lib/api/client";
import { API_ENDPOINTS } from "../../lib/api/client";

export const updateItemStatus = async (
  itemId: number,
  status: number,
): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
};
