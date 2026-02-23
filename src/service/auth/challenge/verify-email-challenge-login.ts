import { verifyLogin } from "@/service/auth/challenge/verify-login";

export async function verifyEmailChallengeLogin(
  flowId: string,
  code: string,
) {
  return verifyLogin({
    method: "EMAIL",
    identifier: flowId,
    code,
  });
}
