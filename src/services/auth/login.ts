import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { LoginResponse } from "@/types/auth/login";

/**
 * ログイン
 */
export const login = async (loginRequest: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  return fetchApi<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
    credentials: "include",
  });
};
