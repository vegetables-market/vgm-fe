import { safeRedirectTo } from "@/lib/next/safeRedirectTo";

export function withRedirectTo(
  url: string,
  redirectTo?: string | null,
): string {
  const safe = safeRedirectTo(redirectTo);
  if (!safe) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}redirect_to=${encodeURIComponent(safe)}`;
}

