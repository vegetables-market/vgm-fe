import { recoveryApi } from "@/lib/api/auth/recovery";
import type { RecoveryMethod } from "@/lib/auth/recovery/types/recovery-method";
import type { VerifyRecoveryChallengeResponseDto } from "@/service/auth/recovery/dto/verify-recovery-challenge-response-dto";

export async function verifyRecoveryChallenge(
  state: string,
  method: RecoveryMethod,
  code: string,
): Promise<VerifyRecoveryChallengeResponseDto> {
  return recoveryApi.verifyChallenge(state, method, code);
}
