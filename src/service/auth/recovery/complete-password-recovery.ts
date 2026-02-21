import { recoveryApi } from "@/lib/api/auth/recovery";

export async function completePasswordRecovery(state: string): Promise<void> {
  await recoveryApi.completeRecovery(state);
}
