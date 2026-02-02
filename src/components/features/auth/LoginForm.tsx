import React from "react";
import { FaCircleExclamation, FaFingerprint } from "react-icons/fa6";
import SocialLoginButtons from "@/components/features/auth/SocialLoginButtons";
import AuthDivider from "@/components/features/auth/ui/AuthDivider";
import AuthInput from "@/components/features/auth/ui/AuthInput";
import AuthButton from "@/components/features/auth/ui/AuthButton";
import SignupLink from "@/components/features/auth/ui/SignupLink";
import { usePasskey } from "@/hooks/auth/usePasskey"; // Add this

interface LoginState {
  step: "email" | "password";
  emailOrUsername: string;
  password: string;
  error: string;
  isLoading: boolean;
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
  const { step, emailOrUsername, password, error, isLoading } = state;
  const { setEmailOrUsername, setPassword, onSubmit, addLog } = actions;
  const { loginWithPasskey, isLoading: isPasskeyLoading } = usePasskey(); // Use hook

  const handlePasskeyLogin = async () => {
    const success = await loginWithPasskey();
    if (success) {
      addLog("Passkey login successful");
      window.location.href = "/"; // Redirect on success (simple handling)
    }
  };

  return (
    <>
      <SocialLoginButtons
        mode="login"
        onProviderClick={(id) => addLog(`Social login clicked: ${id}`)}
      />

      {/* Passkey Button */}
      <div className="mt-3 w-75">
        <button
          type="button"
          onClick={handlePasskeyLogin}
          disabled={isLoading || isPasskeyLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <FaFingerprint className="text-blue-600" />
          パスキーでログイン
        </button>
      </div>

      <AuthDivider />

      {error && (
        <p className="mb-2 flex h-8 w-full items-center justify-center rounded-xs bg-red-600 text-center text-[11px]">
          <FaCircleExclamation className="mr-1" />
          {error}
        </p>
      )}

      <div className="mb-3 w-75">
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

      <SignupLink />
    </>
  );
}
