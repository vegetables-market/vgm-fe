import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { VerifyTotpRequestDto } from "@/service/totp/dto/verify-totp-request-dto";
import type { VerifyTotpResponseDto } from "@/service/totp/dto/verify-totp-response-dto";

/**
 * TOTP検証＆有効化
 */
export const verifyAndEnableTotp = async (
  request: VerifyTotpRequestDto,
): Promise<VerifyTotpResponseDto> => {
  return fetchApi<VerifyTotpResponseDto>(API_ENDPOINTS.TOTP_VERIFY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
