"use client";

import { Suspense } from "react";
import { useSignup } from "@/hooks/auth/signup/useSignup";
import SignupForm from "@/components/features/auth/form/SignupForm";

function SignupPageInner() {
  const { state, actions } = useSignup();

  return <SignupForm state={state} actions={actions} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}
