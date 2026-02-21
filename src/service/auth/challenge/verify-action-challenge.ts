import { VerificationMode } from "@/lib/auth/shared/types/verification-mode";
import { verifyAction } from "@/service/auth/verify-action";
import { AuthMethod } from "@/service/auth/verify-login";

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

  let method = AuthMethod.EMAIL;
  if (mode === "totp") method = AuthMethod.TOTP;
  if (mode === "password") method = AuthMethod.PASSWORD;

  return verifyAction({
    method,
    identifier: resolvedIdentifier,
    code,
    action,
  });
}
