import { useState } from "react";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import { VerificationMode } from "@/types/auth/core";
import VerificationInput from "@/components/ui/auth/verification/VerificationInput";
import VerificationResend from "@/components/ui/auth/verification/VerificationResend";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthInput from "@/components/ui/auth/AuthInput";
import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";
import { FaCircleChevronLeft } from "react-icons/fa6";
import AuthSubTitle from "@/components/ui/auth/AuthSubTitle";
import AuthRecoveryText from "@/components/ui/auth/AuthRecoveryText";

// Type derived from the hook return type
type ChallengeLogic = ReturnType<typeof useChallengeLogic>;

interface ChallengeFormProps {
  mode: VerificationMode;
  action: string | null;
  identifier?: string | null;
  logic: ChallengeLogic;
  onBack: () => void;
}

export default function ChallengeForm({
  mode,
  action,
  identifier,
  logic,
  onBack,
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
    displayEmail,
    onResend,
    onSubmit,
  } = logic;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // --- UI Text Helpers ---
  const getTitle = () => {
    if (action) return "本人確認";
    if (mode === "totp") return "2段階認証";
    if (mode === "password") return "パスワード確認";
    return "メール認証";
  };

  const getDescription = () => {
    if (mode === "totp") {
      return (
        <AuthSubTitle>
          認証アプリに表示されている6桁のコードを入力してください。
        </AuthSubTitle>
      );
    }
    if (mode === "password") {
      return <AuthSubTitle>パスワードを入力してください</AuthSubTitle>;
    }
    // Default: Email
    return (
      <AuthSubTitle>
        {displayEmail && <>{displayEmail}に</>}
        送信された6桁のコードを入力してください。
      </AuthSubTitle>
    );
  };

  const getButtonLabel = () => {
    return "認証する";
  };

  // Check if input is valid for button enablement
  const isSubmitDisabled = () => {
    if (mode === "password") {
      return !code || code.length < 8; // Simple check
    }
    return code.length !== 6;
  };

  return (
    <>
      {/* Back Button */}
      <FaCircleChevronLeft
        className="absolute top-8 left-8 cursor-pointer text-3xl transition-colors hover:text-gray-300"
        onClick={onBack}
      />
      <div className="flex w-75 flex-col items-center">
        <AuthTitle>{getTitle()}</AuthTitle>

        {error && (
          <AuthStatusMessage message={error} variant="error" className="mb-4" />
        )}
        {successMsg && (
          <AuthStatusMessage
            message={successMsg}
            variant="success"
            className="mb-4"
          />
        )}

        <section className="flex w-full flex-col justify-center">
          {/* サブタイトル */}
          {getDescription()}

          {/* ブラウザ・パスワードマネージャー用 隠しユーザー名フィールド */}
          {mode === "password" && identifier && (
            <AuthInput
              label="ユーザー名" // ラベルは空でも良いが、アクセシビリティ的にはあったほうが良いかも？でもhiddenなので関係ない
              name="username"
              value={identifier}
              readOnly
              autoComplete="username"
              className="hidden"
              tabIndex={-1}
            />
          )}

          {/* パスワードの際 */}
          {mode === "password" && (
            <AuthInput
              label="パスワード"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              value={code} // Reuse code state for password
              onChange={(e) => setCode(e.target.value)}
              onTogglePasswordVisibility={togglePasswordVisibility}
              isPasswordVisible={isPasswordVisible}
              hasError={!!error}
              autoComplete="current-password"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmit();
                }
              }}
            />
          )}
          {/* 6桁の場合。 */}
          {mode !== "password" && (
            <VerificationInput
              value={code}
              onChange={setCode}
              onEnter={onSubmit}
              isLoading={isLoading}
              autoComplete={mode === "totp" ? "off" : "one-time-code"}
            />
          )}

          {/* 決定ボタン */}
          <AuthSubmitButton
            onClick={onSubmit}
            isLoading={isLoading}
            disabled={isSubmitDisabled()}
          >
            {getButtonLabel()}
          </AuthSubmitButton>

          {mode === "password" && (
            // <AuthRecoveryText linkText="パスワードを忘れた場合" href="/" />
            <button
              type="button"
              onClick={logic.handleForgotPassword}
              className="text-disabled-foreground hover:text-muted-foreground mx-auto cursor-pointer text-sm hover:underline"
            >
              パスワードを忘れた場合
            </button>
          )}

          {/* Resend Control (Only if supported) */}
          {isResendSupported && mode !== "password" && (
            <VerificationResend
              onResend={onResend}
              isResending={isResending}
              timeLeft={timeLeft}
              resendCooldown={resendCooldown}
            />
          )}
        </section>
      </div>
    </>
  );
}
