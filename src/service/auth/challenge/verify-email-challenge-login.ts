import { AuthMethod, verifyLogin } from "@/service/auth/verify-login";

export async function verifyEmailChallengeLogin(
  flowId: string,
  code: string,
) {
  return verifyLogin({
    method: AuthMethod.EMAIL,
    identifier: flowId,
    code,
  });
}
