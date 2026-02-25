import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";

export const linkImages = async (
  itemId: string,
  filenames: string[],
  options?: { replaceExisting?: boolean },
): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filenames,
      replaceExisting: options?.replaceExisting ?? false,
    }),
  });
};
