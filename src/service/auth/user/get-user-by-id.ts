import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { LoginResponseDto } from "@/service/auth/flow/dto/login-response-dto";

/**
 * ユーザー情報取得
 */
export const getUserById = async (userId: number): Promise<LoginResponseDto> => {
  return fetchApi<LoginResponseDto>(`${API_ENDPOINTS.USER}/${userId}`, {
    method: "GET",
    credentials: "include",
  });
};
