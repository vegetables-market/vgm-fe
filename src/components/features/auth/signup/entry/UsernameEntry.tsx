"use client";

import { useUsernameEntry } from "@/hooks/auth/signup/useUsernameEntry";
import type { UsernameEntryProps } from "@/types/auth/signup-components";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import SignupStepHeader from "@/components/ui/auth/SignupStepHeader";
import AuthSubTitle from "@/components/ui/auth/AuthSubTitle";

export default function UsernameEntry({
  formData,
  setFormData,
  onNext,
}: UsernameEntryProps) {
  const {
    showError,
    checking,
    usernameError,
    suggestions,
    isAvailable,
    isFormatValid,
    handleUsernameChange,
    applySuggestion,
    handleSubmit,
  } = useUsernameEntry({
    username: formData.username,
    setUsername: (value) =>
      setFormData((prev) => ({
        ...prev,
        username: value,
      })),
    onNext,
  });

  const hasError = (showError && !isFormatValid) || !!usernameError;

  let statusMessage = null;
  let statusVariant: "error" | "success" | "info" = "error";

  if (showError && !isFormatValid) {
    statusMessage = "有効なユーザーIDを入力してください。";
    statusVariant = "error";
  } else if (usernameError) {
    statusMessage = usernameError;
    statusVariant = "error";
  } else if (isAvailable && !usernameError) {
    statusMessage = "このIDは使用可能です。";
    statusVariant = "success";
  }

  if (checking && !statusMessage) {
    statusMessage = "確認中...";
    statusVariant = "info";
  }

  return (
    <form onSubmit={handleSubmit}>
      <SignupStepHeader />
      <AuthSubTitle>ユーザーIDを設定</AuthSubTitle>
      <AuthInput
        label="ユーザーID (ログイン用)"
        type="text"
        value={formData.username}
        onChange={(e) => handleUsernameChange(e.target.value)}
        placeholder="user_name_123"
        hasError={hasError}
        isSuccess={!!isAvailable && !usernameError && !checking}
        autoFocus
        className="mb-1"
      />

      {statusMessage && (
        <AuthStatusMessage
          message={statusMessage}
          variant={statusVariant}
          className="mt-2"
          isLoading={checking}
        />
      )}

      <p className="mb-3 text-[11px] text-gray-400">
        3文字以上。英数字とアンダースコアのみ使用できます。
      </p>

      {suggestions.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] text-gray-400">おすすめのID</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => applySuggestion(suggestion)}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-[11px] text-white transition-colors hover:bg-zinc-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <AuthSubmitButton
        disabled={!isFormatValid || checking || !!usernameError}
      >
        次へ
      </AuthSubmitButton>
    </form>
  );
}
