"use client";

import { useLogin } from "@/hooks/auth/login/useLogin";
import LoginForm from "@/components/features/auth/form/LoginForm";

export function LoginContainer() {
  const { state, actions } = useLogin();
  return <LoginForm state={state} actions={actions} />;
}

