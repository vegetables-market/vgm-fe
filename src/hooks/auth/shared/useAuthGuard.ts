import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { getRedirectToFromLocation } from "@/lib/next/getRedirectToFromLocation";
import type { AuthGuardMode } from "@/types/auth/guard";
import { resolveAuthGuardView } from "@/services/auth/auth-guard";

type UseAuthGuardParams = {
  mode: AuthGuardMode;
  hasFallback: boolean;
};

export function useAuthGuard({ mode, hasFallback }: UseAuthGuardParams) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const redirectTo = getRedirectToFromLocation();
  const loginHref = withRedirectTo("/login", redirectTo);

  const viewState = useMemo(
    () =>
      resolveAuthGuardView({
        mode,
        isLoading,
        isAuthenticated,
        hasFallback,
      }),
    [mode, isLoading, isAuthenticated, hasFallback],
  );

  useEffect(() => {
    if (!viewState.shouldRedirect) return;
    router.push(loginHref);
  }, [viewState.shouldRedirect, router, loginHref]);

  return {
    viewState,
    loginHref,
  };
}
