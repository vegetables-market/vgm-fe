import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RecoveryMethod } from "@/lib/auth/recovery/types/recovery-method";
import type { RecoveryStep } from "@/lib/auth/recovery/types/recovery-step";
import { completePasswordRecovery } from "@/service/auth/recovery/complete-password-recovery";
import { getRecoveryOptions } from "@/service/auth/recovery/get-recovery-options";
import { sendRecoveryChallenge } from "@/service/auth/recovery/send-recovery-challenge";
import { verifyRecoveryChallenge } from "@/service/auth/recovery/verify-recovery-challenge";

type UsePasswordRecoveryParams = {
  state: string | null;
};

export function usePasswordRecovery({ state }: UsePasswordRecoveryParams) {
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>("LOADING");
  const [options, setOptions] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod | null>(
    null,
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      setError("セッションが無効です。もう一度最初からやり直してください。");
      setStep("LOADING");
      return;
    }

    const loadOptions = async () => {
      try {
        const response = await getRecoveryOptions(state);
        setOptions(response.options);
        setStep("OPTIONS");
      } catch {
        setError("オプションの取得に失敗しました。");
      }
    };

    void loadOptions();
  }, [state]);

  const onSelectMethod = async (method: RecoveryMethod) => {
    if (!state) return;

    setIsLoading(true);
    setError("");
    try {
      if (method === "email") {
        await sendRecoveryChallenge(state, method);
      }
      setSelectedMethod(method);
      setStep("VERIFY");
    } catch {
      setError("コード送信に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify = async () => {
    if (!state || !selectedMethod) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await verifyRecoveryChallenge(state, selectedMethod, code);

      if (!response.verified) {
        setError("認証に失敗しました。コードを確認して再入力してください。");
        return;
      }

      await completePasswordRecovery(state);
      setStep("COMPLETED");
    } catch {
      setError("認証に失敗しました。コードを確認して再入力してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const onBackToOptions = () => {
    setStep("OPTIONS");
    setCode("");
    setError("");
  };

  const onMoveToLogin = () => {
    router.push("/login");
  };

  return {
    step,
    options,
    selectedMethod,
    code,
    error,
    isLoading,
    setCode,
    onSelectMethod,
    onVerify,
    onBackToOptions,
    onMoveToLogin,
  };
}
