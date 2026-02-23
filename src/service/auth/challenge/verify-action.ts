import { fetchApi } from "@/lib/api/fetch";
import type { VerifyLoginRequestDto } from "@/service/auth/challenge/dto/verify-login-request-dto";
import type { VerifyActionResponseDto } from "@/service/auth/challenge/dto/verify-action-response-dto";

/**
 * セキュリティ確認
 * 重要アクション実行前の再認証でアクショントークンを発行する
 */
export const verifyAction = async (
  request: VerifyLoginRequestDto,
): Promise<VerifyActionResponseDto> => {
  return fetchApi<VerifyActionResponseDto>("/v1/auth/verify-action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
