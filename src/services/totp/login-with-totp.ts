import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { TotpLoginRequest, LoginResponse } from "@/types/auth/login";

/**
 * TOTPログイン
 */
export const loginWithTotp = async (
  request: TotpLoginRequest,
): Promise<LoginResponse> => {
  return fetchApi<LoginResponse>(API_ENDPOINTS.LOGIN_TOTP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
