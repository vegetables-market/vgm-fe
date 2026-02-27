import { fetchApi } from "@/lib/api/fetch";
import type { VerifyAuthCodeResponseDto } from "@/service/auth/challenge/dto/verify-auth-code-response-dto";

/**
 * 認証コードの検証 (事前認証フロー用)
 */
export async function verifyAuthCode(
  flow_id: string,
  code: string,
): Promise<VerifyAuthCodeResponseDto> {
  return fetchApi<VerifyAuthCodeResponseDto>(`/v1/auth/verify-code`, {
    method: "POST",
    body: JSON.stringify({ flow_id, code }),
  });
}

