import { login } from "@/service/auth/login";

export async function loginWithPasswordChallenge(
  username: string,
  password: string,
) {
  return login({ username, password });
}
