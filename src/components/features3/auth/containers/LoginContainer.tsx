"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/auth/login/useLogin";
import LoginForm from "@/components/features3/auth/form/LoginForm";

function LoginContainerInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");
  const { state, actions } = useLogin({ redirectTo });
  return <LoginForm state={state} actions={actions} />;
}

export function LoginContainer() {
  return (
    <Suspense fallback={null}>
      <LoginContainerInner />
    </Suspense>
  );
}
