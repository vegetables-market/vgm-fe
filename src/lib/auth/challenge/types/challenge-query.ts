import type { VerificationMode } from "@/lib/auth/shared/types/verification-mode";

export type ChallengeQuery = {
  typeParam: string | null;
  flowId: string | null;
  mfaToken: string | null;
  action: string | null;
  displayEmail: string | null;
  expiresAt: string | null;
  nextResendAt: string | null;
  redirectTo: string | null;
  returnTo: string | null;
  username: string | null;
  isSignup: boolean;
  mode: VerificationMode;
  identifierForLogic: string | null;
  identifierForView: string | null;
};
