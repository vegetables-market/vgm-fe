"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";
import ChallengeForm from "@/components/features/auth/challenge/ChallengeForm";
import { VerificationMode } from "@/types/auth/core";

function ChallengeContainerInner() {
  const searchParams = useSearchParams();
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

  const router = useRouter();

  // Determine Mode
  let mode: VerificationMode | null = null;
  if (action) {
    if (typeParam === "totp") mode = "totp";
    else if (typeParam === "password") mode = "password";
    else mode = "email"; // Default check for action
  } else if (typeParam === "totp") {
    mode = "totp";
  } else if (typeParam === "password") {
    mode = "password";
  } else if (typeParam === "email" || flowId) {
    mode = "email";
  }

  // If no valid mode, we might want to show error or let the hook handle it
  // For safety, default to email if flowId exists
  const safeMode = mode || "email";

  // 新規登録フローの場合、検証成功後にsignupページへリダイレクト
  const handleSignupVerified = isSignup
    ? () => {
        const params = new URLSearchParams();
        if (flowId) params.set("flow_id", flowId);
        if (displayEmail) params.set("email", displayEmail);
        params.set("verified", "true");
        if (redirectTo) params.set("redirect_to", redirectTo);
        router.push(`/signup?${params.toString()}`);
      }
    : undefined;

  const logic = useChallengeLogic({
    mode: safeMode,
    flowId,
    mfaToken,
    action,
    identifier:
      mode === "totp" ? mfaToken : mode === "password" ? username : flowId,
    displayEmail,
    redirectTo,
    expiresAt,
    nextResendAt,
    onVerifiedAction: handleSignupVerified,
  });

  const handleReturn = () => {
    // If return_to is explicitly set (e.g. for "cancel" or "back" behavior), use it
    if (returnTo) {
      const target = decodeURIComponent(returnTo);
      router.push(target);
      return;
    }

    // Default behavior: go back in history
    router.back();
  };

  return (
    <ChallengeForm
      key={safeMode}
      mode={safeMode}
      action={action}
      identifier={
        mode === "totp"
          ? mfaToken
          : mode === "password"
            ? username
            : displayEmail
      }
      logic={logic}
      onBack={handleReturn}
    />
  );
}

export function ChallengeContainer() {
  return (
    <Suspense fallback={null}>
      <ChallengeContainerInner />
    </Suspense>
  );
}
