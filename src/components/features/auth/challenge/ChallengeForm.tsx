import AuthTitle from "@/components/ui/auth/AuthTitle";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import { VerificationMode } from "@/types/auth/core";
import VerificationInput from "@/components/ui/auth/verification/VerificationInput";
import VerificationResend from "@/components/ui/auth/verification/VerificationResend";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";

// Type derived from the hook return type
type ChallengeLogic = ReturnType<typeof useChallengeLogic>;

interface ChallengeFormProps {
  mode: VerificationMode;
  action: string | null;
  maskedEmail: string | null;
  logic: ChallengeLogic;
  onReturnToLogin: () => void;
}

export default function ChallengeForm({
  mode,
  action,
  maskedEmail,
  logic,
  onReturnToLogin,
}: ChallengeFormProps) {
  const {
    code,
    setCode,
    error,
    successMsg,
    isLoading,
    isResending,
    timeLeft,
    resendCooldown,
    isResendSupported,
    onResend,
    onSubmit,
  } = logic;

  // --- UI Text Helpers ---
  const getTitle = () => {
    if (action) return "セキュリティ確認";
    if (mode === "totp") return "2段階認証";
    return "メール認証";
  };

  const getDescription = () => {
    if (mode === "totp") {
      return (
        <div className="text-center text-sm text-gray-300">
          認証アプリに表示されている
          <br />
          6桁のコードを入力してください。
        </div>
      );
    }
    // Default: Email
    return (
      <div className="text-center text-sm text-gray-300">
        {maskedEmail && (
          <div className="mb-4 text-center">
            <p className="text-sm font-bold text-white">{maskedEmail}</p>
          </div>
        )}
        登録したメールアドレスに送信された
        <br />
        6桁の認証コードを入力してください。
      </div>
    );
  };

  const getButtonLabel = () => {
    if (action === "delete_account") return "削除する";
    return "認証する";
  };

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>{getTitle()}</AuthTitle>

      {error && (
        <AuthStatusMessage message={error} variant="error" className="mb-4" />
      )}

      <div className="flex flex-col items-center">
        {/* Description */}
        <div className="mb-6">{getDescription()}</div>

        {/* Input */}
        <VerificationInput
          value={code}
          onChange={setCode}
          onEnter={onSubmit}
          isLoading={isLoading}
        />

        {/* Status Message (Success) */}
        {successMsg && (
          <div className="mb-4 text-center text-sm text-green-400">
            {successMsg}
          </div>
        )}

        {/* Submit Button */}
        <div className="w-full max-w-[280px]">
          <AuthSubmitButton
            onClick={onSubmit}
            isLoading={isLoading}
            disabled={code.length !== 6}
          >
            {getButtonLabel()}
          </AuthSubmitButton>
        </div>

        {/* Resend Control (Only if supported) */}
        {isResendSupported && (
          <VerificationResend
            onResend={onResend}
            isResending={isResending}
            timeLeft={timeLeft}
            resendCooldown={resendCooldown}
          />
        )}
      </div>

      <div className="mt-6 flex w-full flex-col items-center justify-center gap-4">
        <button
          onClick={onReturnToLogin}
          type="button"
          className="cursor-pointer border-none bg-transparent text-xs text-zinc-500 underline transition-colors hover:text-zinc-300"
        >
          {action === "delete_account" ? "設定に戻る" : "ログイン画面に戻る"}
        </button>
      </div>
    </div>
  );
}
