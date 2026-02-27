import { VerificationMode } from "@/lib/auth/shared/types/verification-mode";
import { verifyAction } from "@/service/auth/challenge/verify-action";
import type { AuthMethodDto } from "@/service/auth/challenge/dto/auth-method-dto";

type VerifyActionChallengeParams = {
  mode: VerificationMode;
  flowId?: string | null;
  mfaToken?: string | null;
  action: string;
  identifier?: string | null;
  code: string;
};

export async function verifyActionChallenge({
  mode,
  flowId,
  mfaToken,
  action,
  identifier,
  code,
}: VerifyActionChallengeParams) {
  const resolvedIdentifier = identifier || (mode === "totp" ? mfaToken : flowId);
  if (!resolvedIdentifier) throw new Error("識別子が見つかりません。");

  let method: AuthMethodDto = "EMAIL";
  if (mode === "totp") method = "TOTP";
  if (mode === "password") method = "PASSWORD";

  return verifyAction({
    method,
    identifier: resolvedIdentifier,
    code,
    action,
  });
}
