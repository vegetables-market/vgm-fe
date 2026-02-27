import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/api/error-handler";
import { resetRecoveryPassword } from "@/service/auth/recovery/reset-recovery-password";

type UseResetPasswordFormParams = {
  token: string | null;
};

export function useResetPasswordForm({ token }: UseResetPasswordFormParams) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) {
      setError("無効なトークンです。");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await resetRecoveryPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(
        getErrorMessage(err) || "パスワードのリセットに失敗しました。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onMoveToLogin = () => {
    router.push("/login");
  };

  return {
    password,
    confirmPassword,
    error,
    success,
    isLoading,
    isPasswordVisible,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    onSubmit,
    onMoveToLogin,
  };
}
