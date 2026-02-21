import { fetchApi } from "@/lib/api/fetch";
import type { RevokeSessionResponse } from "@/types/session";

/**
 * セッション無効化 (ログアウト)
 */
export async function revokeSession(
  sessionId: number,
): Promise<RevokeSessionResponse> {
  return fetchApi<RevokeSessionResponse>(`/v1/user/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

