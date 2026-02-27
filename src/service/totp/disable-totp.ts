import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { DisableTotpRequestDto } from "@/service/totp/dto/disable-totp-request-dto";
import type { DisableTotpResponseDto } from "@/service/totp/dto/disable-totp-response-dto";

/**
 * TOTP無効化
 */
export const disableTotp = async (
  request: DisableTotpRequestDto,
): Promise<DisableTotpResponseDto> => {
  return fetchApi<DisableTotpResponseDto>(API_ENDPOINTS.TOTP_DISABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
