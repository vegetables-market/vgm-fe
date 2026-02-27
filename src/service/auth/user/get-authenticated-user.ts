import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import { ApiError, fetchApi } from "@/lib/api/fetch";
import type { UserInfo } from "@/lib/auth/shared/types/user-info";
import { mapAuthenticatedUser } from "@/service/auth/user/mappers/authenticated-user";

export async function getAuthenticatedUser(): Promise<UserInfo | null> {
  try {
    const response = await fetchApi<unknown>(API_ENDPOINTS.USER_ME, {
      method: "GET",
      credentials: "include",
    });
    return mapAuthenticatedUser(response);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

