import { fetchApi } from "../../lib/api/client";

/**
 * 認証コード再送信
 */
export const resendCode = async (request: {
  flow_id: string;
}): Promise<{
  flow_id: string;
  expires_at: string;
  message: string;
  next_resend_at: string;
}> => {
  return fetchApi<{
    flow_id: string;
    expires_at: string;
    message: string;
    next_resend_at: string;
  }>("/v1/auth/resend-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
};
