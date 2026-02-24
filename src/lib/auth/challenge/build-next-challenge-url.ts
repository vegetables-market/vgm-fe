import type { LoginResponseDto } from "@/service/auth/flow/dto/login-response-dto";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

export function buildNextChallengeUrl(
  data: LoginResponseDto,
  redirectTo?: string | null,
): string | null {
  if (data.status === "MFA_REQUIRED" && data.mfa_token) {
    const mfaType = data.mfa_type?.toLowerCase() || "totp";
    const queryParams = new URLSearchParams();
    queryParams.set("type", mfaType);
    queryParams.set("token", data.mfa_token);
    if (data.masked_email) queryParams.set("masked_email", data.masked_email);
    if (data.flow_id) queryParams.set("flow_id", data.flow_id);
    if (data.expires_at) queryParams.set("expires_at", data.expires_at);
    if (data.next_resend_at) {
      queryParams.set("next_resend_at", data.next_resend_at);
    }
    return withRedirectTo(`/challenge?${queryParams.toString()}`, redirectTo);
  }

  if (data.require_verification && data.flow_id) {
    const queryParams = new URLSearchParams();
    queryParams.set("type", "email");
    queryParams.set("flow_id", data.flow_id);
    if (data.masked_email) queryParams.set("masked_email", data.masked_email);
    if (data.expires_at) queryParams.set("expires_at", data.expires_at);
    if (data.next_resend_at) {
      queryParams.set("next_resend_at", data.next_resend_at);
    }
    return withRedirectTo(`/challenge?${queryParams.toString()}`, redirectTo);
  }

  return null;
}
