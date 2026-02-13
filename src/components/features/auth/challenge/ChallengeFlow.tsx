"use client";

import { VerificationMode } from "@/types/auth/core";
import EmailVerification from "./EmailVerification";
import ActionEmailChallenge from "./action/ActionEmailChallenge";
import MfaEmailForm from "./mfa/MfaEmailForm";
import MfaTotpForm from "./mfa/MfaTotpForm";

type ChallengeFlowProps = {
  mode: VerificationMode;
  flowId?: string | null;
  mfaToken?: string | null;
  action?: string | null;
  maskedEmail?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
  redirectTo?: string | null;
};

export default function ChallengeFlow({
  mode,
  flowId,
  mfaToken,
  action,
  maskedEmail,
  expiresAt,
  nextResendAt,
  redirectTo,
}: ChallengeFlowProps) {
  // 1. Action Verification
  if (action) {
    const identifier = mode === "totp" ? mfaToken : flowId;
    return (
      <ActionEmailChallenge
        mode={mode}
        identifier={identifier || null}
        action={action}
        redirectTo={redirectTo}
      />
    );
  }

  // 2. Email Verification (Signup / Login Unknown)
  if (mode === "email") {
    return (
      <EmailVerification
        flowId={flowId || null}
        maskedEmail={maskedEmail}
        redirectTo={redirectTo}
        expiresAt={expiresAt}
        nextResendAt={nextResendAt}
      />
    );
  }

  // 3. MFA Verification (Email MFA)
  if (mode === "email_mfa") {
    return (
      <MfaEmailForm
        mfaToken={mfaToken || null}
        flowId={flowId || null}
        redirectTo={redirectTo}
        expiresAt={expiresAt}
        nextResendAt={nextResendAt}
      />
    );
  }

  // 4. MFA Verification (TOTP)
  if (mode === "totp") {
    return <MfaTotpForm mfaToken={mfaToken || null} redirectTo={redirectTo} />;
  }

  return (
    <div className="text-center text-red-400">
      不正なリクエストです。(Unknown Mode)
    </div>
  );
}
