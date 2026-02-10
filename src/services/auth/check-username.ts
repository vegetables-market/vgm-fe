import { fetchApi } from "@/lib/api/fetch";

/**
 * ユーザー名の重複チェック
 */
export async function checkUsername(username: string): Promise<{
  available: boolean;
  message?: string;
  suggestions?: string[];
}> {
  return fetchApi<{
    available: boolean;
    message?: string;
    suggestions?: string[];
  }>(`/v1/auth/check-username?username=${username}`, {
    method: "GET",
  });
}

