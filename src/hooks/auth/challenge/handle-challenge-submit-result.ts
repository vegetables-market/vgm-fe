import type { VerifyAuthCodeResponseDto } from "@/service/auth/dto/verify-auth-code-response-dto";
import type { SubmitChallengeResult } from "@/service/auth/challenge/submit-challenge";

type HandleChallengeSubmitResultParams = {
  result: SubmitChallengeResult;
  onSignupVerified?: (data?: VerifyAuthCodeResponseDto) => void;
  onNextChallenge: (url: string) => void;
  onLoginSuccess: (result: Extract<SubmitChallengeResult, { kind: "login_success" }>) => void;
  onActionSuccess: (redirectUrl?: string) => void;
  onError: (message: string) => void;
};

export function handleChallengeSubmitResult({
  result,
  onSignupVerified,
  onNextChallenge,
  onLoginSuccess,
  onActionSuccess,
  onError,
}: HandleChallengeSubmitResultParams): void {
  switch (result.kind) {
    case "signup_verified":
      onSignupVerified?.(result.data);
      return;
    case "next_challenge":
      onNextChallenge(result.url);
      return;
    case "login_success":
      onLoginSuccess(result);
      return;
    case "action_success":
      onActionSuccess(result.redirectUrl);
      return;
    case "error":
      onError(result.message);
      return;
    case "noop":
      return;
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
