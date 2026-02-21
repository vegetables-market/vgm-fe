import { recoveryApi } from "@/lib/api/auth/recovery";

export async function resetRecoveryPassword(
  token: string,
  password: string,
): Promise<void> {
  await recoveryApi.resetPassword(token, password);
}
