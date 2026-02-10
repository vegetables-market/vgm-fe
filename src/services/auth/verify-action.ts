import { fetchApi } from "@/lib/api/fetch";
import type { VerifyAuthRequest } from "./verify-login";

/**
 * セキュリティ確認
 * 重要アクション実行前の再認証でアクショントークンを発行する
 */
export const verifyAction = async (
  request: VerifyAuthRequest,
): Promise<{
  success: boolean;
  action_token: string;
  user: any;
  action: string;
}> => {
  return fetchApi<{
    success: boolean;
    action_token: string;
    user: any;
    action: string;
  }>("/v1/auth/verify-action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
