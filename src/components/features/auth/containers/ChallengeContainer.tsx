"use client";

import { useChallenge } from "@/hooks/auth/challenge/useChallenge";
import ChallengeForm from "@/components/features/auth/form/ChallengeForm";
import { getFirstSearchParam } from "@/lib/next/getFirstSearchParam";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export function ChallengeContainer({ searchParams }: Props) {
  const type = getFirstSearchParam(searchParams?.type);
  const flowId = getFirstSearchParam(searchParams?.flow_id);
  const token = getFirstSearchParam(searchParams?.token);
  const mfaToken = getFirstSearchParam(searchParams?.mfa_token);
  const action = getFirstSearchParam(searchParams?.action);
  const maskedEmail = getFirstSearchParam(searchParams?.masked_email);
  const expiresAt = getFirstSearchParam(searchParams?.expires_at);
  const nextResendAt = getFirstSearchParam(searchParams?.next_resend_at);
  const redirectTo = getFirstSearchParam(searchParams?.redirect_to);

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
