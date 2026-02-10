"use client";

import { useSignup } from "@/hooks/auth/signup/useSignup";
import SignupForm from "@/components/features/auth/form/SignupForm";

type Props = {
  initialEmail: string;
  initialFlowId: string;
};

export default function SignupClient({ initialEmail, initialFlowId }: Props) {
  const { state, actions } = useSignup({
    email: initialEmail,
    flowId: initialFlowId,
  });

  return <SignupForm state={state} actions={actions} />;
}

