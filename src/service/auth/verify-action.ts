import { fetchApi } from "@/lib/api/fetch";
import type { VerifyAuthRequest } from "./verify-login";
import type { VerifyActionResponseDto } from "@/service/auth/dto/verify-action-response-dto";

/**
 * セキュリティ確認
 * 重要アクション実行前の再認証でアクショントークンを発行する
 */
export const verifyAction = async (
  request: VerifyAuthRequest,
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
