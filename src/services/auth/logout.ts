import { fetchApi } from "@/lib/api/fetch";

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  return fetchApi<void>("/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};
