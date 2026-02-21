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
      setError(
        "繧ｻ繝・す繝ｧ繝ｳ縺檎┌蜉ｹ縺ｧ縺吶ゅｂ縺・ｸ蠎ｦ譛蛻昴°繧峩縺励※縺上□縺輔＞縲・",
      );
      setStep("LOADING");
      return;
    }

    const loadOptions = async () => {
      try {
        const response = await getRecoveryOptions(state);
        setOptions(response.options);
        setStep("OPTIONS");
      } catch {
        setError("繧ｪ繝励す繝ｧ繝ｳ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆縲・");
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
      setError("繧ｳ繝ｼ繝峨・騾∽ｿ｡縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲・");
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
        setError(
          "隱崎ｨｼ縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲ゅさ繝ｼ繝峨ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・",
        );
        return;
      }

      await completePasswordRecovery(state);
      setStep("COMPLETED");
    } catch {
      setError(
        "隱崎ｨｼ縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲ゅさ繝ｼ繝峨ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・",
      );
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
