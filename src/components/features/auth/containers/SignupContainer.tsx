"use client";

import { useSignup } from "@/hooks/auth/signup/useSignup";
import SignupForm from "@/components/features/auth/form/SignupForm";
import { getFirstSearchParam } from "@/lib/next/getFirstSearchParam";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export function SignupContainer({ searchParams }: Props) {
  const initialEmail = getFirstSearchParam(searchParams?.email);
  const initialFlowId = getFirstSearchParam(searchParams?.flow_id);
  const redirectTo = getFirstSearchParam(searchParams?.redirect_to);

  const { state, actions } = useSignup({
    email: initialEmail || undefined,
    flowId: initialFlowId || undefined,
    redirectTo,
  });

  return <SignupForm state={state} actions={actions} />;
}
