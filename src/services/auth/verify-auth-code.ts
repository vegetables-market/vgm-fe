import { fetchApi } from "@/lib/api/fetch";

/**
 * 認証コードの検証 (事前認証フロー用)
 */
export async function verifyAuthCode(
  flow_id: string,
  code: string,
): Promise<{ verified: boolean; email: string }> {
  return fetchApi<{ verified: boolean; email: string }>(
    `/v1/auth/verify-code`,
    {
      method: "POST",
      body: JSON.stringify({ flow_id, code }),
    },
  );
}
