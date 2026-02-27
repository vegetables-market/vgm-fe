import { fetchApi } from "@/lib/api/fetch";
import type { SessionResponse } from "@/types/session";

/**
 * アクティブセッション一覧取得
 */
export async function getSessions(): Promise<{ sessions: SessionResponse[] }> {
  return fetchApi<{ sessions: SessionResponse[] }>("/v1/user/sessions", {
    method: "GET",
  });
}

