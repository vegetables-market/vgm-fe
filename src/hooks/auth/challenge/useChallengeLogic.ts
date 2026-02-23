import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { useVerificationCountdown } from "@/hooks/auth/verification/useVerificationCountdown";
import { useChallengeResend } from "@/hooks/auth/challenge/useChallengeResend";
import { handleChallengeSubmitResult } from "@/hooks/auth/challenge/handle-challenge-submit-result";
import { VerificationMode } from "@/lib/auth/shared/types/verification-mode";
import { submitChallenge } from "@/service/auth/challenge/submit-challenge";
import type { LoginResponseDto } from "@/service/auth/dto/login-response-dto";
import type { VerifyAuthCodeResponseDto } from "@/service/auth/challenge/dto/verify-auth-code-response-dto";
import { startPasswordRecovery } from "@/service/auth/recovery/start-password-recovery";

export type UseChallengeLogicParams = {
  mode: VerificationMode;
  flowId?: string | null;
  mfaToken?: string | null;
  action?: string | null;
  identifier?: string | null; // For Action verification
  displayEmail?: string | null;
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
  onVerifiedAction?: (data?: VerifyAuthCodeResponseDto) => void;
};

export function useChallengeLogic({
  mode,
  flowId,
  mfaToken,
  action,
  identifier,
  displayEmail,
  redirectTo,
  expiresAt,
  nextResendAt,
  onVerifiedAction,
}: UseChallengeLogicParams) {
  const {
    code,
    setCode,
    error,
    setError,
    isLoading,
    setIsLoading,
    successMsg,
    setSuccessMsg,
  } = useOtpInput();

  // Reset state when mode OR identifier changes
  useEffect(() => {
    setCode("");
    setError("");
  }, [mode, flowId, mfaToken, identifier, setCode, setError]);

  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { pushRedirect } = useSafeRedirect();
  const isSubmittingRef = useRef(false);

  // --- Resend Logic ---
  // Only applicable for "email" and "email_mfa" modes.
  // "totp" does not support resend.
  const isResendSupported = mode === "email" || mode === "email_mfa";

  const { isResending, resendCooldown, onResend } = useChallengeResend({
    flowId,
    nextResendAt,
    redirectTo,
    maskedEmail: displayEmail,
    setError,
    setSuccessMsg,
    verificationType: mode === "email_mfa" ? "email_mfa" : "email",
    token: mfaToken,
  });

  const { timeLeft } = useVerificationCountdown(expiresAt || undefined);

  // --- Submit Logic ---
  const handleLoginSuccess = (data: LoginResponseDto) => {
    if (data.user) {
      authLogin(data.user);
      localStorage.removeItem("vgm_masked_email");
      pushRedirect(redirectTo, "/");
    } else if (data.require_verification && data.flow_id) {
      // e.g. Email MFA -> TOTP fallback or next step
      router.push(
        withRedirectTo(
          `/challenge?type=email&flow_id=${data.flow_id}`,
          redirectTo,
        ),
      );
    } else {
      setError("ログインに失敗しました。");
    }
  };

  const onSubmit = async () => {
    if (mode !== "password" && code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }
    if (mode === "password" && !code) {
      setError("パスワードを入力してください。");
      return;
    }

    // useRef で即時ガード（React state は非同期なので二重送信を防げない）
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const result = await submitChallenge({
        mode,
        code,
        flowId,
        mfaToken,
        action,
        identifier,
        redirectTo,
        shouldVerifySignupEmail: Boolean(onVerifiedAction && flowId),
      });
      handleChallengeSubmitResult({
        result,
        onSignupVerified: onVerifiedAction,
        onNextChallenge: (url) => router.push(url),
        onLoginSuccess: (loginResult) => handleLoginSuccess(loginResult.data),
        onActionSuccess: (redirectUrl) => {
          setSuccessMsg("認証に成功しました。");
          if (redirectUrl) pushRedirect(redirectUrl);
        },
        onError: setError,
      });
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      handleGlobalError(err, router);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier) {
      setError("ユーザーIDが見つかりません。");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { state } = await startPasswordRecovery(identifier);
      router.push(`/account-recovery/password?state=${state}`);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message || "リカバリーの開始に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    setCode,
    error,
    successMsg,
    isLoading,
    isResending,
    timeLeft,
    resendCooldown,
    isResendSupported,
    displayEmail: displayEmail || null,
    onResend,
    onSubmit,
    handleForgotPassword,
  };
}




