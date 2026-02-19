import { fetchApi } from "@/lib/api/fetch";
import type { InitAuthFlowResult } from "@/types/auth/service";

/**
 * 認証フロー開始 (Login or Register判定)
 */
export async function initAuthFlow(email: string): Promise<InitAuthFlowResult> {
  return fetchApi<InitAuthFlowResult>(`/v1/auth/init-flow`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}


