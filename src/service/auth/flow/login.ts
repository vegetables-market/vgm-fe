import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { LoginResponseDto } from "@/service/auth/dto/login-response-dto";

/**
 * ログイン
 */
export const login = async (loginRequest: {
  username: string;
  password: string;
}): Promise<LoginResponseDto> => {
  return fetchApi<LoginResponseDto>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
    credentials: "include",
  });
};
