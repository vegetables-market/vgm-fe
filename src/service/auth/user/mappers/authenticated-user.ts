import type { UserInfo } from "@/lib/auth/shared/types/user-info";
import { getApiUrl } from "@/lib/api/urls";

type UserPayload = {
  username?: string;
  user_id?: string;
  userId?: string;
  displayName?: string;
  display_name?: string;
  name?: string;
  email?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  isEmailVerified?: boolean;
  is_email_verified?: boolean;
};

export function mapAuthenticatedUser(response: unknown): UserInfo | null {
  if (!response || typeof response !== "object") return null;

  const responseObject = response as Record<string, unknown>;
  const userCandidate =
    "user" in responseObject ? (responseObject.user as UserPayload | null) : null;
  const raw = (userCandidate ?? response) as UserPayload;

  if (!raw) return null;

  const username = raw.username ?? raw.user_id ?? raw.userId ?? "";
  const displayName = raw.displayName ?? raw.display_name ?? raw.name ?? "";
  const email = raw.email ?? null;
  const avatarUrl = normalizeAvatarUrl(raw.avatarUrl ?? raw.avatar_url ?? null);
  const isEmailVerified = raw.isEmailVerified ?? raw.is_email_verified;

  if (!username && !email) return null;

  return {
    username,
    displayName,
    email,
    avatarUrl,
    isEmailVerified,
  };
}

function normalizeAvatarUrl(avatarUrl: string | null): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith("http")) return avatarUrl;
  if (avatarUrl.startsWith("/uploads/")) {
    return `${getApiUrl()}/api${avatarUrl}`;
  }
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
  const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
  const cleanedPath = avatarUrl.startsWith("/") ? avatarUrl.slice(1) : avatarUrl;
  return `${baseUrl}/${cleanedPath}`;
}
