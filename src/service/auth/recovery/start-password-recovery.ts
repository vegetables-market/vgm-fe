import { recoveryApi } from "@/lib/api/auth/recovery";
import type { StartPasswordRecoveryResponseDto } from "@/service/auth/recovery/dto/start-password-recovery-response-dto";

export async function startPasswordRecovery(
  username: string,
): Promise<StartPasswordRecoveryResponseDto> {
  return recoveryApi.start(username);
}
