import { fetchApi } from "@/lib/api/fetch";
import type { CheckUsernameResult } from "@/types/auth/service";

/**
 * ユーザー名の重複チェック
 */
export async function checkUsername(username: string): Promise<CheckUsernameResult> {
  return fetchApi<CheckUsernameResult>(
    `/v1/auth/check-username?username=${username}`,
    {
      method: "GET",
    },
  );
}


