import { fetchApi } from "../../lib/api/client";
import { API_ENDPOINTS } from "../../lib/api/client";
import type { LoginResponse } from "@/types/auth";

/**
 * ログイン
 */
export const login = async (loginRequest: {
  email: string;
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
