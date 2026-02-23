import type { ReactNode } from "react";

export type AuthGuardMode = "redirect" | "content";

export type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  mode?: AuthGuardMode;
  showLoginLink?: boolean;
};
