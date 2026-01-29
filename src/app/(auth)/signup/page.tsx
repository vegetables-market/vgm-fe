"use client";

import { useSignup } from "@/hooks/auth/useSignup";
import SignupForm from "@/components/features/auth/SignupForm";

export default function SignupPage() {
  const { state, actions } = useSignup();

  return <SignupForm state={state} actions={actions} />;
}
