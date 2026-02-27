import { recoveryApi } from "@/lib/api/auth/recovery";

export async function requestIdRecovery(email: string): Promise<void> {
  await recoveryApi.forgotId(email);
}
