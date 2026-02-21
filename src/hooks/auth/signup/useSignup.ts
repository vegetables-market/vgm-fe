import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "@/services/auth/register";
import { getErrorMessage } from "@/lib/api/error-handler";
import { SignupFormData } from "@/types/auth/core";
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
  const searchParams = useSearchParams();

  // verified=true・医メ繝｣繝ｬ繝ｳ繧ｸ逕ｻ髱｢縺ｧ隱崎ｨｼ貂医∩・峨↑繧蔚sernameEntry(2)縺九ｉ髢句ｧ・
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

  // OAuth登録フローの初期化
  useEffect(() => {
    const useOauthSession = searchParams.get("use_oauth_session");
    if (useOauthSession === "true") {
       const token = sessionStorage.getItem("signup_oauth_token");
       const provider = sessionStorage.getItem("signup_oauth_provider");
       const email = searchParams.get("email") || "";
       const name = searchParams.get("name") || "";

       if (token) {
           addLog("Initializing OAuth signup flow");
           setFormData(prev => ({
               ...prev,
               email,
               name, // 表示名として使用
               oauth_token: token,
               oauth_provider: provider || undefined
           }));
           // メール認証確認ステップをスキップしてユーザー名入力へ
           setStep(2); 
       }
    }
  }, [searchParams]);

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
      oauth_provider: formData.oauth_provider
    };
    addLog(`Submitting signup data: ${JSON.stringify(requestData)}`);

    try {
      const data = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        display_name: formData.name, // display_name繧置sername縺ｧ蛻晄悄蛹・
        flow_id: formData.flow_id,
        // 繝励Ο繝輔ぅ繝ｼ繝ｫ髢｢騾｣縺ｯ逵∫払・医ヰ繝・け繧ｨ繝ｳ繝峨′Nullable縺ｾ縺溘・繝・ヵ繧ｩ繝ｫ繝亥､繧呈戟縺､蜑肴署・・
        oauth_token: formData.oauth_token, // OAuth Tokenを含める
        oauth_provider: formData.oauth_provider
      });
      
      // 成功したらセッションストレージをクリア
      if (formData.oauth_token) {
          sessionStorage.removeItem("signup_oauth_token");
          sessionStorage.removeItem("signup_oauth_provider");
      }

      addLog(`Signup successful: ${JSON.stringify(data)}`);

      if (data.status === "AUTHENTICATED" && data.user) {
        // 隱崎ｨｼ貂医∩: 繝ｭ繧ｰ繧､繝ｳ迥ｶ諷九↓縺励※繝帙・繝縺ｸ驕ｷ遘ｻ
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
