import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { UploadTokenResponse } from "@/types/upload";

export const getUploadToken = async (): Promise<UploadTokenResponse> => {
  return fetchApi<UploadTokenResponse>(`${API_ENDPOINTS.ITEMS}/upload-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
