import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth/register";
import { getErrorMessage } from "@/lib/api/error-handler";
import { SignupFormData } from "@/types/auth/user";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";

type SignupInitialParams = {
  email?: string;
  flowId?: string;
  verified?: boolean;
  redirectTo?: string | null;
};

export function useSignup(initial?: SignupInitialParams) {
  const initialEmail = initial?.email || "";
  const initialFlowId = initial?.flowId || "";
  const redirectTo = initial?.redirectTo || null;

  // verified=true（チャレンジ画面で認証済み）ならUsernameEntry(2)から開始
  const [step, setStep] = useState(
    initial?.verified && initialFlowId ? 2 : initialFlowId ? 1 : 0
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: initialEmail,
    username: "",
    password: "",
    name: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    flow_id: initialFlowId || undefined,
  });
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { pushRedirect } = useSafeRedirect();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleNext = () => {
    setError("");
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const requestData = {
      username: formData.username,
      email: formData.email,
      password: formData.password ? "***" : "empty",
      display_name: formData.name,
      birth_year: formData.birthYear,
      birth_month: formData.birthMonth,
      birth_day: formData.birthDay,
      gender: formData.gender,
    };
    addLog(`Submitting signup data: ${JSON.stringify(requestData)}`);

    try {
      const data = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        display_name: formData.username, // display_nameをusernameで初期化
        flow_id: formData.flow_id,
        // プロフィール関連は省略（バックエンドがNullableまたはデフォルト値を持つ前提）
      });

      addLog(`Signup successful: ${JSON.stringify(data)}`);

      if (data.status === "AUTHENTICATED" && data.user) {
        // 認証済み: ログイン状態にしてホームへ遷移
        addLog("Signup completed with auto-login");
        authLogin(data.user);
        pushRedirect(redirectTo, "/");
      } else if (data.require_verification && data.flow_id) {
        if (data.masked_email) {
          localStorage.setItem("vgm_masked_email", data.masked_email);
        }
        router.push(withRedirectTo(`/challenge?flow_id=${data.flow_id}`, redirectTo));
      } else {
        router.push(withRedirectTo("/login", redirectTo));
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      addLog(`Signup error: ${message}`);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      step,
      error,
      loading,
      formData,
      redirectTo,
    },
    actions: {
      setStep,
      setFormData,
      handleNext,
      handlePrev,
      handleSubmit,
      addLog,
    },
  };
}
