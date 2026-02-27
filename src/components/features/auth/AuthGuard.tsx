"use client";

import Link from "next/link";
import { useAuthGuard } from "@/hooks/auth/shared/useAuthGuard";
import type { AuthGuardProps } from "@/components/features/auth/types/auth-guard-props";

export default function AuthGuard({
  children,
  fallback,
  mode = "content",
  showLoginLink = true,
}: AuthGuardProps) {
  const { viewState, loginHref } = useAuthGuard({
    mode,
    hasFallback: !!fallback,
  });

  if (viewState.showLoading) {
    return (
      fallback || (
        <div className="flex h-screen w-screen items-center justify-center bg-black">
          <div className="text-white">読み込み中...</div>
        </div>
      )
    );
  }

  if (viewState.showChildren) {
    return <>{children}</>;
  }

  if (viewState.showNothing) {
    return null;
  }

  if (viewState.showFallback) {
    return <>{fallback}</>;
  }

  if (!viewState.showDefaultGuest) {
    return null;
  }

  return (
    <div className="mt-4">
      <p className="mb-4 text-gray-600">ログインが必要です</p>
      {showLoginLink && (
        <Link href={loginHref} className="text-blue-500 hover:underline">
          ログイン →
        </Link>
      )}
    </div>
  );
}
