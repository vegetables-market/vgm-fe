"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/auth/login/useLogin";
import LoginForm from "./LoginForm";

function LoginContainerInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");
  const rawConnectProvider = searchParams.get("connect");
  const connectProvider =
    rawConnectProvider === "google" ||
    rawConnectProvider === "microsoft" ||
    rawConnectProvider === "github"
      ? rawConnectProvider
      : null;
  const { state, actions } = useLogin({ redirectTo });
  return (
    <LoginForm
      state={state}
      actions={actions}
      connectProvider={connectProvider}
    />
  );
}

export function LoginContainer() {
  return (
    <Suspense fallback={null}>
      <LoginContainerInner />
    </Suspense>
  );
}
