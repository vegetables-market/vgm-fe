"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { verifyAction } from "@/services/auth/verify-action";
import { resendCode } from "@/services/auth/resend-code";
import { verifyAuthCode } from "@/services/auth/verify-auth-code";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import {
  useVerificationCountdown,
  useResendCooldown,
} from "@/hooks/auth/verification/useVerificationCountdown";

export type VerificationMode = "email" | "email_mfa" | "totp";

type UseVerificationFlowParams = {
  mode: VerificationMode;
  flowId?: string | null;
  mfaToken?: string | null;
  action?: string | null;
  redirectTo?: string | null;
  maskedEmail?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export function useVerificationFlow({
  mode,
  flowId,
  mfaToken,
  action,
  redirectTo,
  maskedEmail: propMaskedEmail,
  expiresAt,
  nextResendAt,
}: UseVerificationFlowParams) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(
    propMaskedEmail || null,
  );

  // Email verification specific hooks
  const { timeLeft } = useVerificationCountdown(expiresAt || undefined);
  const { resendCooldown } = useResendCooldown(nextResendAt || undefined);

  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { pushRedirect } = useSafeRedirect();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("vgm_masked_email");
    if (storedEmail && !maskedEmail) {
      setMaskedEmail(storedEmail);
    }
  }, [maskedEmail]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }

    setIsLoading(true);
    setError("");
    addLog(`Submitting verification for mode: ${mode}`);

    try {
      // 1. Action Verification (Email or TOTP)
      if (action) {
        const method = mode === "totp" ? AuthMethod.TOTP : AuthMethod.EMAIL;
        const identifier = mode === "totp" ? mfaToken : flowId;

        if (!identifier) throw new Error("Identifier missing for action");

        const data = await verifyAction({
          method,
          identifier,
          code,
          action,
        });
        addLog(`Action verification successful: ${JSON.stringify(data)}`);

        const safe = safeRedirectTo(redirectTo);
        if (data.action_token && safe) {
          const separator = safe.includes("?") ? "&" : "?";
          router.push(`${safe}${separator}action_token=${data.action_token}`);
        }
        return;
      }

      // 2. Email Signup/Login-Unknown Verification (Primary flow)
      if (mode === "email") {
        if (!flowId) throw new Error("Flow ID missing for email verification");

        try {
          // First try verifyAuthCode (Signup flow)
          const codeResult = await verifyAuthCode(flowId, code);
          addLog(`Code verification successful: ${JSON.stringify(codeResult)}`);

          if (codeResult.verified) {
            const targetEmail = codeResult.email || "";
            router.push(
              withRedirectTo(
                `/signup?email=${encodeURIComponent(
                  targetEmail,
                )}&flow_id=${flowId}&verified=true`,
                redirectTo,
              ),
            );
            return;
          }
        } catch (codeErr: any) {
          addLog(
            `Code verification failed, trying login flow: ${getErrorMessage(
              codeErr,
            )}`,
          );
          // Fallback to login verification (Login Unknown Device)
          const data = await verifyLogin({
            method: AuthMethod.EMAIL,
            identifier: flowId,
            code,
          });
          handleLoginSuccess(data);
        }
        return;
      }

      // 3. MFA Verification (Email MFA or TOTP)
      if (mode === "email_mfa" || mode === "totp") {
        if (!mfaToken) throw new Error("MFA Token missing");
        
        const data = await verifyLogin({
          method: AuthMethod.TOTP,
          identifier: mfaToken,
          code,
        });
        handleLoginSuccess(data);
      }

    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      if (mode === "email") {
        handleGlobalError(err, router);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (data: any) => {
    addLog(`Login verification successful: ${JSON.stringify(data)}`);
    if (data.user) {
      authLogin(data.user);
      localStorage.removeItem("vgm_masked_email");
      pushRedirect(redirectTo, "/");
    } else if (data.require_verification && data.flow_id) {
       // Loop back to challenge if another step is needed
       // Note: This logic was in MFA hooks.
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

  const onResend = async () => {
    if (mode === "totp") return; // TOTP has no resend
    if (isResending || (resendCooldown && resendCooldown > 0)) return;
    if (!flowId) return;

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await resendCode({ flow_id: flowId });
      addLog(`Resend successful. New flow_id: ${data.flow_id}`);
      setSuccessMsg("認証コードを再送しました。");

      // Reload page with new params
      const base = `/challenge?type=email&flow_id=${data.flow_id}&expires_at=${data.expires_at}&next_resend_at=${data.next_resend_at}`;
      const withAction = action
        ? `${base}&action=${encodeURIComponent(action)}`
        : base;
      const newUrl = withRedirectTo(withAction, redirectTo);
      router.replace(newUrl);
    } catch (err: any) {
       if (
        err.info?.error === "RESEND_LIMIT_EXCEEDED" ||
        err.message?.includes("再送回数の上限")
      ) {
        setError(
          "再送回数の上限に達しました。ログイン画面に戻ります。",
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return {
    code,
    setCode,
    error,
    successMsg,
    isLoading,
    isResending,
    maskedEmail,
    timeLeft,
    resendCooldown,
    onSubmit,
    onResend: mode === "totp" ? undefined : onResend,
  };
}
