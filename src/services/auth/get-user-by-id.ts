import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { LoginResponse } from "@/types/auth/login";

/**
 * ユーザー情報取得
 */
export const getUserById = async (userId: number): Promise<LoginResponse> => {
  return fetchApi<LoginResponse>(`${API_ENDPOINTS.USER}/${userId}`, {
    method: "GET",
    credentials: "include",
  });
};
