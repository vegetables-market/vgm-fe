"use client";

import { VerificationMode } from "@/components/features/auth/types";
import EmailChallenge from "./EmailChallenge";
import MfaChallenge from "./MfaChallenge";
import ActionChallenge from "./ActionChallenge";

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
      <ActionChallenge
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
      <EmailChallenge
        flowId={flowId || null}
        maskedEmail={maskedEmail}
        redirectTo={redirectTo}
        expiresAt={expiresAt}
        nextResendAt={nextResendAt}
      />
    );
  }

  // 3. MFA Verification (Email MFA or TOTP)
  if (mode === "email_mfa" || mode === "totp") {
    return (
      <MfaChallenge
        mode={mode}
        mfaToken={mfaToken || null}
        flowId={flowId || null} // Needed for email_mfa resend
        redirectTo={redirectTo}
        expiresAt={expiresAt}
        nextResendAt={nextResendAt}
      />
    );
  }

  return (
    <div className="text-center text-red-400">
      不正なリクエストです。(Unknown Mode)
    </div>
  );
}
