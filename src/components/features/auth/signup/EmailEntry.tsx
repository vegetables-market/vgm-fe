import AuthSocialButtons from "@/components/ui/auth/AuthSocialButtons";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthSwitchLink from "@/components/ui/auth/AuthSwitchLink";
import Divider from "@/components/ui/auth/Divider";
import OrDivider from "@/components/ui/auth/OrDivider";
import { useEmailEntry } from "@/hooks/auth/signup/useEmailEntry";
import type { EmailEntryProps } from "@/types/auth/signup-components";

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
            label="繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ"
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
              message="譛牙柑縺ｪ繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧貞・蜉帙＠縺ｦ縺上□縺輔＞縲・
              variant="error"
            />
          )}
        </section>

        <AuthSubmitButton isLoading={isLoading} loadingText="遒ｺ隱堺ｸｭ...">
          谺｡縺ｸ
        </AuthSubmitButton>
      </form>

      <OrDivider />

      <AuthSocialButtons
        mode="signup"
        onProviderClick={(id) => addLog(`Social signup: ${id}`)}
      />
      <Divider />

      <AuthSwitchLink
        promptText="繧｢繧ｫ繧ｦ繝ｳ繝医ｒ縺頑戟縺｡縺ｮ譁ｹ縺ｯ"
        linkText="縺薙％縺九ｉ繝ｭ繧ｰ繧､繝ｳ"
        href="/login"
        redirectTo={redirectTo}
      />
    </>
  );
}
