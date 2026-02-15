import AuthSocialButtons from "@/components/ui/auth/AuthSocialButtons";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthSwitchLink from "@/components/ui/auth/AuthSwitchLink";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import OrDivider from "@/components/ui/auth/OrDivider";
import type { LoginFormProps } from "@/types/auth/login-components";
import AuthRecoveryText from "@/components/ui/auth/AuthRecoveryText";

export default function LoginForm({ state, actions }: LoginFormProps) {
  const { emailOrUsername, error, isLoading, redirectTo } = state;
  const { setEmailOrUsername, onSubmit, addLog } = actions;

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>ログイン</AuthTitle>

      <AuthSocialButtons
        mode="login"
        onProviderClick={(id) => addLog(`Social login clicked: ${id}`)}
      />

      <OrDivider />

      {error && <AuthStatusMessage message={error} variant="error" />}

      <div className="">
        <form onSubmit={onSubmit}>
          <AuthInput
            label="メールアドレスまたはユーザーID"
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />

          <AuthSubmitButton isLoading={isLoading} loadingText="確認中...">
            つぎへ
          </AuthSubmitButton>
        </form>
      </div>

      <AuthSwitchLink
        promptText="アカウントを"
        linkText="新規登録する"
        href="/signup"
        redirectTo={redirectTo}
      />

      <AuthRecoveryText
        linkText="ログインにお困りですか？"
        href="/account-recovery/id"
        redirectTo={redirectTo}
      />
    </div>
  );
}
