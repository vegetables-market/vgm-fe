import type { AuthGuardMode } from "@/types/auth/guard";

export type AuthGuardViewState = {
  showLoading: boolean;
  showChildren: boolean;
  showNothing: boolean;
  showFallback: boolean;
  showDefaultGuest: boolean;
  shouldRedirect: boolean;
};

type ResolveAuthGuardViewParams = {
  mode: AuthGuardMode;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasFallback: boolean;
};

export function resolveAuthGuardView({
  mode,
  isLoading,
  isAuthenticated,
  hasFallback,
}: ResolveAuthGuardViewParams): AuthGuardViewState {
  if (mode === "redirect") {
    if (isLoading) {
      return {
        showLoading: true,
        showChildren: false,
        showNothing: false,
        showFallback: false,
        showDefaultGuest: false,
        shouldRedirect: false,
      };
    }

    if (isAuthenticated) {
      return {
        showLoading: false,
        showChildren: true,
        showNothing: false,
        showFallback: false,
        showDefaultGuest: false,
        shouldRedirect: false,
      };
    }

    return {
      showLoading: false,
      showChildren: false,
      showNothing: true,
      showFallback: false,
      showDefaultGuest: false,
      shouldRedirect: true,
    };
  }

  if (isLoading) {
    return {
      showLoading: false,
      showChildren: false,
      showNothing: !hasFallback,
      showFallback: hasFallback,
      showDefaultGuest: false,
      shouldRedirect: false,
    };
  }

  if (isAuthenticated) {
    return {
      showLoading: false,
      showChildren: true,
      showNothing: false,
      showFallback: false,
      showDefaultGuest: false,
      shouldRedirect: false,
    };
  }

  return {
    showLoading: false,
    showChildren: false,
    showNothing: false,
    showFallback: hasFallback,
    showDefaultGuest: !hasFallback,
    shouldRedirect: false,
  };
}
