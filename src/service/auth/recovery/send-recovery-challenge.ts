import { recoveryApi } from "@/lib/api/auth/recovery";
import type { RecoveryMethod } from "@/lib/auth/recovery/types/recovery-method";

export async function sendRecoveryChallenge(
  state: string,
  method: RecoveryMethod,
): Promise<void> {
  await recoveryApi.sendChallenge(state, method);
}
