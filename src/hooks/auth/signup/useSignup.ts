import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addAuthLog } from "@/lib/auth/debug/add-auth-log";
import { SignupFormData } from "@/lib/auth/signup/types/signup-form-data";
import { getErrorMessage } from "@/lib/api/error-handler";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { register } from "@/service/auth/register";

const SIGNUP_VERIFIED_FLOW_ID_KEY = "signup_verified_flow_id";

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
  const hasVerifiedFlowId =
    typeof window !== "undefined" &&
    !!initialFlowId &&
    initial?.verified === true &&
    sessionStorage.getItem(SIGNUP_VERIFIED_FLOW_ID_KEY) === initialFlowId;

  // verified=true は Challenge 成功時に保存した flow_id と一致する場合のみ採用する
  const [step, setStep] = useState(hasVerifiedFlowId ? 2 : initialFlowId ? 1 : 0);
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

  const addLog = (msg: string) => addAuthLog(msg);

  // OAuth 登録フロー初期化
  useEffect(() => {
    const useOauthSession = searchParams.get("use_oauth_session");
    if (useOauthSession === "true") {
      const token = sessionStorage.getItem("signup_oauth_token");
      const provider = sessionStorage.getItem("signup_oauth_provider");
      const email = searchParams.get("email") || "";
      const name = searchParams.get("name") || "";

      if (token) {
        addLog("Initializing OAuth signup flow");
        setFormData((prev) => ({
          ...prev,
          email,
          name,
          oauth_token: token,
          oauth_provider: provider || undefined,
        }));
        setStep(2);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hasVerifiedFlowId) return;
    sessionStorage.removeItem(SIGNUP_VERIFIED_FLOW_ID_KEY);
  }, [hasVerifiedFlowId]);

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
      oauth_provider: formData.oauth_provider,
    };
    addLog(`Submitting signup data: ${JSON.stringify(requestData)}`);

    try {
      const data = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        display_name: formData.name,
        flow_id: formData.flow_id,
        oauth_token: formData.oauth_token,
        oauth_provider: formData.oauth_provider,
      });

      if (formData.oauth_token) {
        sessionStorage.removeItem("signup_oauth_token");
        sessionStorage.removeItem("signup_oauth_provider");
      }

      addLog(`Signup successful: ${JSON.stringify(data)}`);

      if (data.status === "AUTHENTICATED" && data.user) {
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
    } catch (err: unknown) {
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
