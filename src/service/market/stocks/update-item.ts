import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { UpdateItemRequestDto } from "@/service/market/stocks/dto/update-item-request-dto";

export const updateItem = async (
  itemId: string,
  data: UpdateItemRequestDto,
): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
