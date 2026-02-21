import type { ReadonlyURLSearchParams } from "next/navigation";
import type { VerificationMode } from "@/lib/auth/shared/types/verification-mode";
import type { ChallengeQuery } from "@/lib/auth/challenge/types/challenge-query";

export function parseChallengeQuery(
  searchParams: ReadonlyURLSearchParams,
): ChallengeQuery {
  const typeParam = searchParams.get("type");
  const flowId = searchParams.get("flow_id");
  const mfaToken = searchParams.get("token") || searchParams.get("mfa_token");
  const action = searchParams.get("action");
  const displayEmail =
    searchParams.get("email") || searchParams.get("masked_email");
  const expiresAt = searchParams.get("expires_at");
  const nextResendAt = searchParams.get("next_resend_at");
  const redirectTo = searchParams.get("redirect_to");
  const returnTo = searchParams.get("return_to");
  const username = searchParams.get("username");
  const isSignup = searchParams.get("signup") === "true";

  let mode: VerificationMode | null = null;
  if (action) {
    if (typeParam === "totp") mode = "totp";
    else if (typeParam === "password") mode = "password";
    else if (typeParam === "email_mfa") mode = "email_mfa";
    else mode = "email";
  } else if (typeParam === "totp") {
    mode = "totp";
  } else if (typeParam === "password") {
    mode = "password";
  } else if (typeParam === "email_mfa") {
    mode = "email_mfa";
  } else if (typeParam === "email" || flowId) {
    mode = "email";
  }

  const safeMode = mode || "email";
  const identifierForLogic =
    safeMode === "totp"
      ? mfaToken
      : safeMode === "password"
        ? username
        : safeMode === "email_mfa"
          ? mfaToken
          : flowId;
  const identifierForView =
    safeMode === "totp"
      ? mfaToken
      : safeMode === "password"
        ? username
        : displayEmail;

  return {
    typeParam,
    flowId,
    mfaToken,
    action,
    displayEmail,
    expiresAt,
    nextResendAt,
    redirectTo,
    returnTo,
    username,
    isSignup,
    mode: safeMode,
    identifierForLogic,
    identifierForView,
  };
}
