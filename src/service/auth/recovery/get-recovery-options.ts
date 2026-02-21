import { recoveryApi } from "@/lib/api/auth/recovery";
import type { GetRecoveryOptionsResponseDto } from "@/service/auth/recovery/dto/get-recovery-options-response-dto";

export async function getRecoveryOptions(
  state: string,
): Promise<GetRecoveryOptionsResponseDto> {
  return recoveryApi.getOptions(state);
}
