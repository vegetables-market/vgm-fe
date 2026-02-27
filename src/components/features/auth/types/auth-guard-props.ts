import type { ReactNode } from "react";
import type { AuthGuardMode } from "@/lib/auth/guard/types/auth-guard-mode";

export type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  mode?: AuthGuardMode;
  showLoginLink?: boolean;
};
