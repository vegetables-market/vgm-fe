import { AuthMethod, verifyLogin } from "@/service/auth/verify-login";

export async function verifyTotpChallengeLogin(
  mfaToken: string,
  code: string,
) {
  return verifyLogin({
    method: AuthMethod.TOTP,
    identifier: mfaToken,
    code,
  });
}
