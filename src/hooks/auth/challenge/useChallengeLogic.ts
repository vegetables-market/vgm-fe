import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { verifyAuthCode } from "@/services/auth/verify-auth-code";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { useVerificationCountdown } from "@/hooks/auth/verification/useVerificationCountdown";
import { useChallengeResend } from "@/hooks/auth/challenge/useChallengeResend";
import { VerificationMode } from "@/types/auth/core";
import { verifyAction } from "@/services/auth/verify-action";
import { login } from "@/services/auth/login";

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
  onVerifiedAction?: (data?: any) => void;
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
    setSuccessMsg: setSuccessMsg as (msg: string) => void,
    verificationType: mode === "email_mfa" ? "email_mfa" : "email",
    token: mfaToken,
  });

  const { timeLeft } = useVerificationCountdown(expiresAt || undefined);

  // --- Submit Logic ---
  const handleLoginSuccess = (data: any) => {
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
      if (action) {
        // 4. Action Verification (Delete Account etc)
        const id = identifier || (mode === "totp" ? mfaToken : flowId);
        if (!id) throw new Error("識別子が見つかりません。");

        let method = AuthMethod.EMAIL;
        if (mode === "totp") method = AuthMethod.TOTP;
        if (mode === "password") method = AuthMethod.PASSWORD;

        const res = await verifyAction({
          method,
          identifier: id,
          code,
          action,
        });

        setSuccessMsg("認証に成功しました。");

        if (redirectTo) {
          let finalRedirectUrl = redirectTo;
          if (res.action_token) {
            const separator = finalRedirectUrl.includes("?") ? "&" : "?";
            finalRedirectUrl = `${finalRedirectUrl}${separator}action_token=${encodeURIComponent(res.action_token)}`;
          }
          pushRedirect(finalRedirectUrl);
        }
        return;
      }

      if (mode === "email") {
        // 1. Email Verification (Signup or Login)
        if (onVerifiedAction && flowId) {
          // Signup flow: verifyAuthCode で検証し、コールバックで次のステップへ
          const codeResult = await verifyAuthCode(flowId, code);
          if (codeResult.verified) {
            onVerifiedAction(codeResult);
            return;
          }
        } else if (flowId) {
          // Login flow: verifyLogin でセッション作成
          const data = await verifyLogin({
            method: AuthMethod.EMAIL,
            identifier: flowId,
            code,
          });
          handleLoginSuccess(data);
        } else {
          throw new Error("フローIDが見つかりません。");
        }
      } else if (mode === "totp") {
        // 2. TOTP Verification
        if (!mfaToken) throw new Error("MFAトークンが見つかりません。");
        const data = await verifyLogin({
          method: AuthMethod.TOTP,
          identifier: mfaToken,
          code,
        });
        handleLoginSuccess(data);
      } else if (mode === "password") {
        if (!identifier) throw new Error("ユーザーIDが見つかりません。");

        // Call standard login API
        const data = await login({ username: identifier, password: code });

        if (data.status === "MFA_REQUIRED" && data.mfa_token) {
          // TOTP/Email MFAへ遷移
          const mfaType = data.mfa_type?.toLowerCase() || "totp";
          const queryParams = new URLSearchParams();
          queryParams.set("type", mfaType);
          queryParams.set("token", data.mfa_token);
          if (data.masked_email) {
            queryParams.set("masked_email", data.masked_email);
          }
          if (data.flow_id) {
            queryParams.set("flow_id", data.flow_id);
          }
          if (data.expires_at) {
            queryParams.set("expires_at", data.expires_at);
          }
          if (data.next_resend_at) {
            queryParams.set("next_resend_at", data.next_resend_at);
          }
          
          const nextUrl = withRedirectTo(
            `/challenge?${queryParams.toString()}`,
            redirectTo,
          );
          router.push(nextUrl);
          return;
        } else if (data.require_verification && data.flow_id) {
          // Email Verificationへ遷移
          const queryParams = new URLSearchParams();
          queryParams.set("type", "email");
          queryParams.set("flow_id", data.flow_id);
          if (data.masked_email) {
            queryParams.set("masked_email", data.masked_email);
          }
          if (data.expires_at) {
            queryParams.set("expires_at", data.expires_at);
          }
          if (data.next_resend_at) {
            queryParams.set("next_resend_at", data.next_resend_at);
          }

          const nextUrl = withRedirectTo(
            `/challenge?${queryParams.toString()}`,
            redirectTo,
          );
          router.push(nextUrl);
          return;
        } else if (data.user) {
          // Login Success
          handleLoginSuccess(data);
          return;
        } else {
          // Fallback error
          setError("ユーザー名またはパスワードが間違っています。");
        }
      } else if (mode === "email_mfa") {
        // 3. Email MFA (Login Known Device)
        if (!mfaToken) throw new Error("MFAトークンが見つかりません。");
        setError("この認証モードは現在サポートされていません。");
      }
    } catch (err: any) {
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
      // Lazy import to avoid circular dependency if any (though recoveryApi should be fine)
      const { recoveryApi } = await import("@/lib/api/auth/recovery");
      const { state } = await recoveryApi.start(identifier);
      router.push(`/account-recovery/password?state=${state}`);
    } catch (err: any) {
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
