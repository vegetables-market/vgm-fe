import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "@/services/authService";
import { getErrorMessage } from "@/lib/api/error-handler";
import { SignupFormData } from "@/types/auth";

export function useSignup() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialFlowId = searchParams.get("flow_id") || "";
  
  const [step, setStep] = useState(initialFlowId ? 1 : 0); // flow_idがあればVerifyStep(1)から開始
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

      if (data.require_verification && data.flow_id) {
        if (data.masked_email) {
          localStorage.setItem("vgm_masked_email", data.masked_email);
        }
        router.push(`/challenge?flow_id=${data.flow_id}`);
      } else {
        router.push("/login");
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
