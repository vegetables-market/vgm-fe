import AuthSocialButtons from "@/components/ui/auth/AuthSocialButtons";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthSwitchLink from "@/components/ui/auth/AuthSwitchLink";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import OrDivider from "@/components/ui/auth/OrDivider";
import type { LoginFormProps } from "./types";

export default function LoginForm({ state, actions }: LoginFormProps) {
  const { step, emailOrUsername, password, error, isLoading, redirectTo } =
    state;
  const { setEmailOrUsername, setPassword, onSubmit, addLog } = actions;

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>ログイン</AuthTitle>

      <AuthSocialButtons
        mode="login"
        onProviderClick={(id) => addLog(`Social login clicked: ${id}`)}
      />

      <OrDivider />

      {error && <AuthStatusMessage message={error} variant="error" />}

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

          <AuthSubmitButton isLoading={isLoading} loadingText="確認中...">
            {step === "email" ? "次へ" : "ログイン"}
          </AuthSubmitButton>
        </form>
      </div>

      <AuthSwitchLink
        promptText="アカウントを"
        linkText="新規登録する"
        href="/signup"
        redirectTo={redirectTo}
      />
    </div>
  );
}
