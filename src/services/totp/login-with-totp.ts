import { fetchApi } from "../../lib/api/client";
import { API_ENDPOINTS } from "../../lib/api/client";
import type { TotpLoginRequest, LoginResponse } from "@/types/auth";

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
