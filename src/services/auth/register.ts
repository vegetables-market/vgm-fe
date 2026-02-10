import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { RegisterRequest, RegisterResponse } from "@/types/auth/register";

/**
 * 新規登録
 */
export const register = async (
  registerRequest: RegisterRequest,
): Promise<RegisterResponse> => {
  return fetchApi<RegisterResponse>(API_ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
    credentials: "include",
  });
};
