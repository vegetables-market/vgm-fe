import { login } from "@/service/auth/flow/login";

export async function loginWithPasswordChallenge(
  username: string,
  password: string,
) {
  return login({ username, password });
}
