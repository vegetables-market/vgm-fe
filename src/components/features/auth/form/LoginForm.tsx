import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import SocialLoginButtons from "@/components/features3/auth/SocialLoginButtons";
import AuthDivider from "@/components/features3/auth/ui/AuthDivider";
import AuthInput from "@/components/features3/auth/ui/AuthInput";
import AuthButton from "@/components/features3/auth/ui/AuthButton";
import SignupLink from "@/components/features3/auth/ui/SignupLink";
import AuthTitle from "@/components/features3/auth/ui/AuthTitle";

interface LoginState {
  step: "email" | "password";
  emailOrUsername: string;
  password: string;
  error: string;
  isLoading: boolean;
  redirectTo: string | null;
}

interface LoginActions {
  setEmailOrUsername: (value: string) => void;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  addLog: (msg: string) => void;
}

interface LoginFormProps {
  state: LoginState;
  actions: LoginActions;
}

export default function LoginForm({ state, actions }: LoginFormProps) {
  const { step, emailOrUsername, password, error, isLoading, redirectTo } =
    state;
  const { setEmailOrUsername, setPassword, onSubmit, addLog } = actions;

  return (
    <>
      <div className="flex w-75 flex-col items-center">
        <AuthTitle>ログイン</AuthTitle>
        <SocialLoginButtons
          mode="login"
          onProviderClick={(id) => addLog(`Social login clicked: ${id}`)}
        />

        <AuthDivider />
        {error && (
          <p className="mb-2 flex h-8 w-full items-center justify-center rounded-xs bg-red-600 text-center text-[11px]">
            <FaCircleExclamation className="mr-1" />
            {error}
          </p>
        )}
        <div className="mb-3">
          <form onSubmit={onSubmit}>
            <AuthInput
              label="メールアドレスまたはユーザーID"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />

            {step === "password" && (
              <AuthInput
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                autoFocus
                disabled={isLoading}
              />
            )}

            <AuthButton type="submit" isLoading={isLoading}>
              {step === "email" ? "次へ" : "ログイン"}
            </AuthButton>
          </form>
        </div>
        <SignupLink redirectTo={redirectTo} />
      </div>
    </>
  );
}
