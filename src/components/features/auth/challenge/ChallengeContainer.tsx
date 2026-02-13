"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";
import ChallengeForm from "@/components/features/auth/challenge/ChallengeForm";
import { VerificationMode } from "@/types/auth/core";

function ChallengeContainerInner() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const flowId = searchParams.get("flow_id");
  const mfaToken = searchParams.get("token") || searchParams.get("mfa_token");
  const action = searchParams.get("action");
  const maskedEmail = searchParams.get("masked_email");
  const expiresAt = searchParams.get("expires_at");
  const nextResendAt = searchParams.get("next_resend_at");
  const redirectTo = searchParams.get("redirect_to");

  // Determine Mode
  let mode: VerificationMode | null = null;
  if (action) {
    mode = typeParam === "totp" ? "totp" : "email"; // Simple heuristic for action
  } else if (typeParam === "totp") {
    mode = "totp";
  } else if (typeParam === "email" || flowId) {
    mode = "email";
  }

  // If no valid mode, we might want to show error or let the hook handle it
  // For safety, default to email if flowId exists
  const safeMode = mode || "email";

  const logic = useChallengeLogic({
    mode: safeMode,
    flowId,
    mfaToken,
    action,
    identifier: mode === "totp" ? mfaToken : flowId,
    redirectTo,
    expiresAt,
    nextResendAt,
  });

  return (
    <ChallengeForm
      mode={safeMode}
      action={action}
      maskedEmail={maskedEmail}
      logic={logic}
      onReturnToLogin={() => (window.location.href = "/login")} // Or use router
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
