"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useChallenge } from "@/hooks/auth/challenge/useChallenge";
import ChallengeForm from "@/components/features/auth/form/ChallengeForm";

function ChallengeContainerInner() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const flowId = searchParams.get("flow_id");
  const token = searchParams.get("token");
  const mfaToken = searchParams.get("mfa_token");
  const action = searchParams.get("action");
  const maskedEmail = searchParams.get("masked_email");
  const expiresAt = searchParams.get("expires_at");
  const nextResendAt = searchParams.get("next_resend_at");
  const redirectTo = searchParams.get("redirect_to");

  const { state, actions } = useChallenge({
    type: type || undefined,
    flowId: flowId || undefined,
    mfaToken: token || mfaToken || undefined,
    action: action || undefined,
    maskedEmail: maskedEmail || undefined,
    expiresAt: expiresAt || undefined,
    nextResendAt: nextResendAt || undefined,
    redirectTo: redirectTo || undefined,
  });
  return <ChallengeForm state={state} actions={actions} />;
}

export function ChallengeContainer() {
  return (
    <Suspense fallback={null}>
      <ChallengeContainerInner />
    </Suspense>
  );
}
