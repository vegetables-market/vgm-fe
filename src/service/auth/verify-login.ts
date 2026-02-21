import { fetchApi } from "@/lib/api/fetch";
import type { LoginResponse } from "@/types/auth/login";

/**
 * 認証方式
 */
export enum AuthMethod {
  EMAIL = "EMAIL",
  TOTP = "TOTP",
  PASSWORD = "PASSWORD",
}

export interface VerifyAuthRequest {
  method: AuthMethod;
  identifier: string;
  code: string;
  action?: string;
}

/**
 * ログイン完了
 * EMAIL/TOTP認証後にセッションを作成してログインを完了する
 */
export const verifyLogin = async (
  request: VerifyAuthRequest,
): Promise<LoginResponse> => {
  return fetchApi<LoginResponse>("/v1/auth/verify-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
