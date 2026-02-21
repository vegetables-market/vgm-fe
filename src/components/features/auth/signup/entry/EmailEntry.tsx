import AuthSocialButtons from "@/components/ui/auth/AuthSocialButtons";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthSwitchLink from "@/components/ui/auth/AuthSwitchLink";
import Divider from "@/components/ui/auth/Divider";
import OrDivider from "@/components/ui/auth/OrDivider";
import { useEmailEntry } from "@/hooks/auth/signup/useEmailEntry";
import type { EmailEntryProps } from "@/components/features/auth/signup/types/entry-props";
import SignupStepHeader from "@/components/ui/auth/SignupStepHeader";
import AuthTitle from "@/components/ui/auth/AuthTitle";

export default function EmailEntry({
  formData,
  setFormData,
  addLog,
  redirectTo,
}: EmailEntryProps) {
  const {
    isLoading,
    hasEmailError,
    errorMessage,
    clearEmailError,
    onSubmit,
  } = useEmailEntry({
      email: formData.email,
      redirectTo,
      addLog,
    });

  return (
    <>
      {/* タイトル */}
      <AuthTitle>新規登録</AuthTitle>

      <form onSubmit={onSubmit} className="w-full">
        <SignupStepHeader />
        <AuthInput
          label="メールアドレス"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            clearEmailError();
          }}
          placeholder="mail@example.com"
          autoFocus
          disabled={isLoading}
          hasError={hasEmailError}
        />

        {hasEmailError && (
          <AuthStatusMessage
            message="有効なメールアドレスを入力してください。"
            variant="error"
          />
        )}
        {!hasEmailError && errorMessage && (
          <AuthStatusMessage message={errorMessage} variant="error" />
        )}

        <AuthSubmitButton isLoading={isLoading} loadingText="確認中...">
          続行
        </AuthSubmitButton>
      </form>

      <OrDivider />

      <AuthSocialButtons
        mode="signup"
        onProviderClick={(id) => addLog(`Social signup: ${id}`)}
      />
      <Divider />

      <AuthSwitchLink
        promptText="アカウントをお持ちの方は"
        linkText="ここからログイン"
        href="/login"
        redirectTo={redirectTo}
      />
    </>
  );
}

