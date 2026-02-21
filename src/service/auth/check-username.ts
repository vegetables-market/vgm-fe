import { fetchApi } from "@/lib/api/fetch";
import type { CheckUsernameResultDto } from "@/service/auth/dto/check-username-result-dto";

/**
 * ユーザー名の重複チェック
 */
export async function checkUsername(username: string): Promise<CheckUsernameResultDto> {
  return fetchApi<CheckUsernameResultDto>(
    `/v1/auth/check-username?username=${username}`,
    {
      method: "GET",
    },
  );
}


