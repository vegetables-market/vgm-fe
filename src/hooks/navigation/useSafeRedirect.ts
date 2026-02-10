"use client";

import { useRouter } from "next/navigation";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";

export function useSafeRedirect() {
  const router = useRouter();

  const pushRedirect = (redirectTo?: string | null, fallback: string = "/") => {
    router.push(safeRedirectTo(redirectTo) || fallback);
  };

  const replaceRedirect = (
    redirectTo?: string | null,
    fallback: string = "/",
  ) => {
    router.replace(safeRedirectTo(redirectTo) || fallback);
  };

  return { pushRedirect, replaceRedirect };
}

