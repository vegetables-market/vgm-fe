import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { EnableTotpRequestDto } from "@/service/totp/dto/enable-totp-request-dto";
import type { EnableTotpResponseDto } from "@/service/totp/dto/enable-totp-response-dto";

/**
 * TOTP有効化開始
 */
export const enableTotp = async (
  request: EnableTotpRequestDto,
): Promise<EnableTotpResponseDto> => {
  return fetchApi<EnableTotpResponseDto>(API_ENDPOINTS.TOTP_ENABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
