"use client";

import { usePasswordEntry } from "@/hooks/auth/signup/usePasswordEntry";
import type { PasswordEntryProps } from "@/components/features/auth/signup/types/entry-props";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import SignupStepHeader from "@/components/ui/auth/SignupStepHeader";
import AuthValidationItem from "@/components/ui/auth/AuthValidationItem";
import AuthSubTitle from "@/components/ui/auth/AuthSubTitle";

export default function PasswordEntry({
  formData,
  setFormData,
  onNext,
}: PasswordEntryProps) {
  const {
    showError,
    isPasswordVisible,
    validations,
    clearError,
    togglePasswordVisibility,
    handleSubmit,
  } = usePasswordEntry({
    password: formData.password,
    onNext,
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* 新規登録のステップの進行度を示すバー */}
      <SignupStepHeader />

      {/* タイトル */}
      <AuthSubTitle>パスワードを設定</AuthSubTitle>

      <section>
        <input
          type="text"
          name="username"
          value={formData.username}
          readOnly
          autoComplete="username"
          className="hidden"
        />

        <AuthInput
          label="パスワード"
          type={isPasswordVisible ? "text" : "password"}
          name="new-password"
          value={formData.password}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, password: e.target.value }));
            clearError();
          }}
          hasError={showError && !validations.isValid}
          autoFocus
          autoComplete="new-password"
          onTogglePasswordVisibility={togglePasswordVisibility}
          isPasswordVisible={isPasswordVisible}
          isSuccess={validations.isValid}
        />

        <h3 className="mb-3 text-[13px] font-bold">
          以下の条件を満たす必要があります
        </h3>
        <div className="mb-2 flex flex-col gap-1">
          <AuthValidationItem
            isValid={validations.hasLetter}
            label="英字を1文字以上含む"
            showError={showError}
          />
          <AuthValidationItem
            isValid={validations.hasNumberOrSpecialChar}
            label="数字または記号を1つ以上含む"
            showError={showError}
          />
          <AuthValidationItem
            isValid={validations.isLengthValid}
            label="10文字以上"
            showError={showError}
          />
        </div>
      </section>

      <AuthSubmitButton>次へ</AuthSubmitButton>
    </form>
  );
}

