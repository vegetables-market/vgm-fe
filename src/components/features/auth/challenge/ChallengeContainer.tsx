"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";
import ChallengeForm from "@/components/features/auth/challenge/ChallengeForm";
import { parseChallengeQuery } from "@/lib/auth/challenge/parse-challenge-query";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";

const SIGNUP_VERIFIED_FLOW_ID_KEY = "signup_verified_flow_id";

function ChallengeContainerInner() {
  const searchParams = useSearchParams();
  const {
    flowId,
    mfaToken,
    action,
    displayEmail,
    expiresAt,
    nextResendAt,
    redirectTo,
    returnTo,
    isSignup,
    mode,
    identifierForLogic,
    identifierForView,
  } = parseChallengeQuery(searchParams);

  const router = useRouter();

  // 新規登録フローの場合、検証成功後にsignupページへリダイレクト
  const handleSignupVerified = isSignup
    ? () => {
        if (flowId) {
          sessionStorage.setItem(SIGNUP_VERIFIED_FLOW_ID_KEY, flowId);
        }

        const params = new URLSearchParams();
        if (flowId) params.set("flow_id", flowId);
        if (displayEmail) params.set("email", displayEmail);
        params.set("verified", "true");
        if (redirectTo) params.set("redirect_to", redirectTo);
        router.push(`/signup?${params.toString()}`);
      }
    : undefined;

  const logic = useChallengeLogic({
    mode,
    flowId,
    mfaToken,
    action,
    identifier: identifierForLogic,
    displayEmail,
    redirectTo,
    expiresAt,
    nextResendAt,
    onVerifiedAction: handleSignupVerified,
  });

  const handleReturn = () => {
      // If return_to is explicitly set (e.g. for "cancel" or "back" behavior), use it
      if (returnTo) {
          const target = safeRedirectTo(returnTo);
          if (target) {
            router.push(target);
            return;
          }
      }
      
      // Default behavior: go back in history
      router.back();
  };

  return (
    <ChallengeForm
      key={mode}
      mode={mode}
      action={action}
      identifier={identifierForView}
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

