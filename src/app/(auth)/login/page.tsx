"use client";

import { useLogin } from "@/hooks/auth/useLogin";
import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  const { state, actions } = useLogin();

  return (
    <div className="flex w-75 flex-col items-center">
      <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold">
        ログイン
      </h2>

      <LoginForm state={state} actions={actions} />
    </div>
  );
}
