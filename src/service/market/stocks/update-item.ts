import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type {
  EditStockPayload,
  NewStockPayload,
} from "@/lib/market/stocks/build-update-item-payload";

export const updateItem = async (
  itemId: string,
  data: NewStockPayload | EditStockPayload,
): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
