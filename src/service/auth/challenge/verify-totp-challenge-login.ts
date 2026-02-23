import { verifyLogin } from "@/service/auth/challenge/verify-login";

export async function verifyTotpChallengeLogin(
  mfaToken: string,
  code: string,
) {
  return verifyLogin({
    method: "TOTP",
    identifier: mfaToken,
    code,
  });
}
