import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";
import { getErrorMessage } from "@/lib/api/error-handler";
import { SignupFormData } from "@/types/auth";

export function useSignup() {
  const [step, setStep] = useState(0); // 0:Email, 1:Username, 2:Password, 3:Profile, 4:Terms
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    username: "",
    password: "",
    name: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
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
        display_name: formData.name,
        birth_year: formData.birthYear
          ? parseInt(formData.birthYear)
          : undefined,
        birth_month: formData.birthMonth
          ? parseInt(formData.birthMonth)
          : undefined,
        birth_day: formData.birthDay ? parseInt(formData.birthDay) : undefined,
        gender: formData.gender || undefined,
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
