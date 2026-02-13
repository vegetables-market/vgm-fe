"use client";

import { FaCircleExclamation } from "react-icons/fa6";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import { useUsernameEntry } from "@/hooks/auth/signup/useUsernameEntry";
import type { UsernameEntryProps } from "@/types/auth/signup-components";

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 1 / 4</p>
        <p className="text-base font-bold text-white">ユーザーIDを設定</p>
      </div>

      <section>
        <div className="mb-2 w-full">
          <span className="text-[13px] font-bold text-white">
            ユーザーID (ログイン用)
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder="user_name_123"
            className={`mb-1 h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
              (showError && !isFormatValid) || usernameError
                ? "!border-red-400"
                : isAvailable
                  ? "!border-green-500"
                  : "!border-white/70 focus:!border-white"
            }`}
            autoFocus
          />
        </div>

        <p className="mt-1 text-[11px] text-gray-400">
          3文字以上。英数字とアンダースコアのみ使用できます。
        </p>

        {showError && !isFormatValid && (
          <div className="mt-2 flex items-center text-xs text-red-400">
            <FaCircleExclamation className="mr-1" />
            <p>有効なユーザーIDを入力してください。</p>
          </div>
        )}

        {usernameError && (
          <AuthStatusMessage
            message={usernameError}
            variant="error"
            className="mt-2"
          />
        )}

        {isAvailable && !usernameError && !checking && (
          <AuthStatusMessage
            message="このIDは使用可能です。"
            variant="success"
            className="mt-2"
          />
        )}

        {suggestions.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-gray-400">おすすめのID:</p>
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

        {checking && !usernameError && (
          <div className="mt-1 text-xs text-gray-500">確認中...</div>
        )}
      </section>

      <AuthSubmitButton disabled={!isFormatValid || checking || !!usernameError}>
        次へ
      </AuthSubmitButton>
    </form>
  );
}
