import { fetchApi } from "@/lib/api/fetch";

/**
 * 認証フロー開始 (Login or Register判定)
 */
export async function initAuthFlow(email: string): Promise<{
  flow: "LOGIN" | "REGISTER" | "CHALLENGE";
  flow_id?: string;
  expires_at?: string;
  next_resend_at?: string;
}> {
  return fetchApi<{
    flow: "LOGIN" | "REGISTER" | "CHALLENGE";
    flow_id?: string;
    expires_at?: string;
    next_resend_at?: string;
  }>(`/v1/auth/init-flow`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

