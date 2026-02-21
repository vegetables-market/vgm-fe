import { AuthMethod, verifyLogin } from "@/service/auth/verify-login";

export async function verifyEmailMfaChallengeLogin(
  mfaToken: string,
  code: string,
) {
  return verifyLogin({
    method: AuthMethod.EMAIL,
    identifier: mfaToken,
    code,
  });
}
