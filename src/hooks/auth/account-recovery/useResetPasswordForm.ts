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
      setError("辟｡蜉ｹ縺ｪ繝医・繧ｯ繝ｳ縺ｧ縺吶・");
      return;
    }
    if (password !== confirmPassword) {
      setError("繝代せ繝ｯ繝ｼ繝峨′荳閾ｴ縺励∪縺帙ｓ縲・");
      return;
    }
    if (password.length < 8) {
      setError("繝代せ繝ｯ繝ｼ繝峨・8譁・ｭ嶺ｻ･荳翫〒蜈･蜉帙＠縺ｦ縺上□縺輔＞縲・");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await resetRecoveryPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(
        getErrorMessage(err) ||
          "繝代せ繝ｯ繝ｼ繝峨・繝ｪ繧ｻ繝・ヨ縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲・",
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
