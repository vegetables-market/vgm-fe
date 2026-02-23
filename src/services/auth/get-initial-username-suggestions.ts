import { fetchApi } from "@/lib/api/fetch";

/**
 * 初期おすすめユーザー名の取得
 */
export async function getInitialUsernameSuggestions(): Promise<{
  suggestions: string[];
}> {
  return fetchApi<{ suggestions: string[] }>(`/v1/auth/suggestions`, {
    method: "GET",
  });
}
