import { safeRedirectTo } from "@/lib/next/safeRedirectTo";

const AUTH_ROUTES = ["/login", "/signup", "/challenge"];

export function getRedirectToFromLocation(): string | null {
  if (typeof window === "undefined") return null;

  const current = `${window.location.pathname}${window.location.search}`;
  const safe = safeRedirectTo(current);
  if (!safe) return null;

  if (
    AUTH_ROUTES.some((route) => safe === route || safe.startsWith(`${route}?`))
  ) {
    return null;
  }

  return safe;
}

