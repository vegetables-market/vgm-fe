import { verifyLogin } from "@/service/auth/challenge/verify-login";

export async function verifyEmailMfaChallengeLogin(
  mfaToken: string,
  code: string,
) {
  return verifyLogin({
    method: "EMAIL",
    identifier: mfaToken,
    code,
  });
}
