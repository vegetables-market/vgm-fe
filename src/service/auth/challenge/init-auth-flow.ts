import { fetchApi } from "@/lib/api/fetch";
import type { InitAuthFlowResultDto } from "@/service/auth/challenge/dto/init-auth-flow-result-dto";

/**
 * 認証フロー開始 (Login or Register判定)
 */
export async function initAuthFlow(email: string): Promise<InitAuthFlowResultDto> {
  return fetchApi<InitAuthFlowResultDto>(`/v1/auth/init-flow`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}


