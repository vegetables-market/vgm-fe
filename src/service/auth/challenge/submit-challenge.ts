import type { VerificationMode } from "@/lib/auth/shared/types/verification-mode";
import { buildNextChallengeUrl } from "@/lib/auth/challenge/build-next-challenge-url";
import type { LoginResponseDto } from "@/service/auth/dto/login-response-dto";
import type { VerifyAuthCodeResponseDto } from "@/service/auth/dto/verify-auth-code-response-dto";
import { verifyAuthCode } from "@/service/auth/verify-auth-code";
import { loginWithPasswordChallenge } from "@/service/auth/challenge/login-with-password-challenge";
import { verifyActionChallenge } from "@/service/auth/challenge/verify-action-challenge";
import { verifyEmailChallengeLogin } from "@/service/auth/challenge/verify-email-challenge-login";
import { verifyEmailMfaChallengeLogin } from "@/service/auth/challenge/verify-email-mfa-challenge-login";
import { verifyTotpChallengeLogin } from "@/service/auth/challenge/verify-totp-challenge-login";

type SubmitChallengeParams = {
  mode: VerificationMode;
  code: string;
  flowId?: string | null;
  mfaToken?: string | null;
  action?: string | null;
  identifier?: string | null;
  redirectTo?: string | null;
  shouldVerifySignupEmail: boolean;
};

export type SubmitChallengeResult =
  | { kind: "signup_verified"; data: VerifyAuthCodeResponseDto }
  | { kind: "next_challenge"; url: string }
  | { kind: "login_success"; data: LoginResponseDto }
  | { kind: "action_success"; redirectUrl?: string }
  | { kind: "error"; message: string }
  | { kind: "noop" };

export async function submitChallenge({
  mode,
  code,
  flowId,
  mfaToken,
  action,
  identifier,
  redirectTo,
  shouldVerifySignupEmail,
}: SubmitChallengeParams): Promise<SubmitChallengeResult> {
  if (action) {
    const response = await verifyActionChallenge({
      mode,
      flowId,
      mfaToken,
      action,
      identifier,
      code,
    });
    if (!redirectTo) return { kind: "action_success" };

    let redirectUrl = redirectTo;
    if (response.action_token) {
      const separator = redirectUrl.includes("?") ? "&" : "?";
      redirectUrl = `${redirectUrl}${separator}action_token=${encodeURIComponent(response.action_token)}`;
    }
    return { kind: "action_success", redirectUrl };
  }

  if (mode === "email") {
    if (shouldVerifySignupEmail && flowId) {
      const data = await verifyAuthCode(flowId, code);
      if (data.verified) return { kind: "signup_verified", data };
      return { kind: "error", message: "認証コードが正しくありません。" };
    }
    if (!flowId) throw new Error("フローIDが見つかりません。");
    const data = await verifyEmailChallengeLogin(flowId, code);
    return { kind: "login_success", data };
  }

  if (mode === "totp") {
    if (!mfaToken) throw new Error("MFAトークンが見つかりません。");
    const data = await verifyTotpChallengeLogin(mfaToken, code);
    return { kind: "login_success", data };
  }

  if (mode === "password") {
    if (!identifier) throw new Error("ユーザーIDが見つかりません。");
    const data = await loginWithPasswordChallenge(identifier, code);
    const nextUrl = buildNextChallengeUrl(data, redirectTo);
    if (nextUrl) return { kind: "next_challenge", url: nextUrl };
    if (data.user) return { kind: "login_success", data };
    return { kind: "error", message: "ユーザー名またはパスワードが間違っています。" };
  }

  if (mode === "email_mfa") {
    if (!mfaToken) throw new Error("MFAトークンが見つかりません。");
    const data = await verifyEmailMfaChallengeLogin(mfaToken, code);
    return { kind: "login_success", data };
  }

  return { kind: "noop" };
}
