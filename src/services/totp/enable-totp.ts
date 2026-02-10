import { fetchApi } from "../../lib/api/client";
import { API_ENDPOINTS } from "../../lib/api/client";
import type { EnableTotpRequest, EnableTotpResponse } from "@/types/auth";

/**
 * TOTP有効化開始
 */
export const enableTotp = async (
  request: EnableTotpRequest,
): Promise<EnableTotpResponse> => {
  return fetchApi<EnableTotpResponse>(API_ENDPOINTS.TOTP_ENABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
