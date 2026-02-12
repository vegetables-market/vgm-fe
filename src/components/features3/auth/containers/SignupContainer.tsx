"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSignup } from "@/hooks/auth/signup/useSignup";
import SignupForm from "@/components/features3/auth/form/SignupForm";

function SignupContainerInner() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email");
  const initialFlowId = searchParams.get("flow_id");
  const redirectTo = searchParams.get("redirect_to");
  const verified = searchParams.get("verified") === "true";
  const { state, actions } = useSignup({
    email: initialEmail || undefined,
    flowId: initialFlowId || undefined,
    verified,
    redirectTo,
  });

  return <SignupForm state={state} actions={actions} />;
}

export function SignupContainer() {
  return (
    <Suspense fallback={null}>
      <SignupContainerInner />
    </Suspense>
  );
}
