import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { TotpLoginRequestDto } from "@/service/totp/dto/totp-login-request-dto";
import type { LoginResponseDto } from "@/service/auth/flow/dto/login-response-dto";

/**
 * TOTPログイン
 */
export const loginWithTotp = async (
  request: TotpLoginRequestDto,
): Promise<LoginResponseDto> => {
  return fetchApi<LoginResponseDto>(API_ENDPOINTS.LOGIN_TOTP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
