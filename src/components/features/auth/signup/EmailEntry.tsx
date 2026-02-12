import SocialLoginButtons from "@/components/features3/auth/SocialLoginButtons";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthSwitchLink from "@/components/ui/auth/AuthSwitchLink";
import Divider from "@/components/ui/auth/Divider";
import OrDivider from "@/components/ui/auth/OrDivider";
import { useEmailEntry } from "@/hooks/auth/signup/useEmailEntry";
import type { EmailEntryProps } from "./types";

export default function EmailEntry({
  formData,
  setFormData,
  addLog,
  redirectTo,
}: EmailEntryProps) {
  const { isLoading, hasEmailError, clearEmailError, onSubmit } = useEmailEntry(
    {
      email: formData.email,
      redirectTo,
      addLog,
    },
  );

  return (
    <>
      <form onSubmit={onSubmit}>
        <section>
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
            className="bg-black text-white"
          />

          {hasEmailError && (
            <AuthStatusMessage
              message="有効なメールアドレスを入力してください。"
              variant="error"
            />
          )}
        </section>

        <AuthSubmitButton isLoading={isLoading} loadingText="確認中...">
          次へ
        </AuthSubmitButton>
      </form>

      <OrDivider />

      <SocialLoginButtons
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
