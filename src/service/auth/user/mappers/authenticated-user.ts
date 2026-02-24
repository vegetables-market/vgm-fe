import type { UserInfo } from "@/lib/auth/shared/types/user-info";

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
  const avatarUrl = raw.avatarUrl ?? raw.avatar_url ?? null;
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

