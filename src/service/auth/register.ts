import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { RegisterRequestDto } from "@/service/auth/dto/register-request-dto";
import type { RegisterResponseDto } from "@/service/auth/dto/register-response-dto";

/**
 * 新規登録
 */
export const register = async (
  registerRequest: RegisterRequestDto,
): Promise<RegisterResponseDto> => {
  return fetchApi<RegisterResponseDto>(API_ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
    credentials: "include",
  });
};
