"use client";

import { useLogin } from "@/hooks/auth/login/useLogin";
import LoginForm from "@/components/features/auth/form/LoginForm";
import { getFirstSearchParam } from "@/lib/next/getFirstSearchParam";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export function LoginContainer({ searchParams }: Props) {
  const redirectTo = getFirstSearchParam(searchParams?.redirect_to);
  const { state, actions } = useLogin({ redirectTo });
  return <LoginForm state={state} actions={actions} />;
}
