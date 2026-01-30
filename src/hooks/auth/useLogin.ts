import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ステップ1: ユーザーID入力後
    if (step === "email") {
      if (!emailOrUsername) {
        setError("メールアドレスまたはユーザーIDを入力してください。");
        return;
      }

      // セキュリティ向上（User Enumeration対策）のため、常にパスワード入力へ進む
      addLog(`Proceeding to password step for: ${emailOrUsername}`);
      setStep("password");
      return;
    }

    // ステップ2: パスワード入力後
    if (step === "password") {
      if (!password) {
        setError("パスワードを入力してください。");
        return;
      }

      setIsLoading(true);
      addLog(`Attempting login with password for: ${emailOrUsername}`);
      try {
        const data = await login({ username: emailOrUsername, password });

        if (data.status === "MFA_REQUIRED" && data.mfa_token) {
          addLog("MFA Required. Redirecting to challenge page.");
          
          if (data.masked_email) {
            localStorage.setItem("vgm_masked_email", data.masked_email);
          }

          const mfaType = data.mfa_type?.toLowerCase() || "totp";
          router.push(
            `/challenge?type=${mfaType}&token=${encodeURIComponent(data.mfa_token)}`,
          );
        } else if (data.require_verification) {
          if (data.flow_id) {
            addLog("Verification required after password check.");
            if (data.masked_email) {
              localStorage.setItem("vgm_masked_email", data.masked_email);
            }
            router.push(`/challenge?type=email&flow_id=${data.flow_id}`);
          } else {
            addLog("Login failed: Invalid credentials.");
            setError(
              "メールアドレス、ユーザーIDまたはパスワードが間違っています。",
            );
          }
        } else if (data.user) {
          addLog("Login successful!");
          authLogin(data.user);
          router.push("/");
        }
      } catch (err: any) {
        const message = getErrorMessage(err);
        setError(message);
        handleGlobalError(err, router);
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  return {
    state: {
      step,
      emailOrUsername,
      password,
      error,
      isLoading,
    },
    actions: {
      setEmailOrUsername,
      setPassword,
      onSubmit: handleSubmit,
      addLog,
    },
  };
}
