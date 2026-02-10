import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth/login";
import { initAuthFlow } from "@/services/auth/init-auth-flow";
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
    // ステップ1: ユーザーID入力後
    if (step === "email") {
      if (!emailOrUsername) {
        setError("メールアドレスまたはユーザーIDを入力してください。");
        return;
      }

      // メールアドレス形式の簡易チェック
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);

      if (!isEmail) {
        // ユーザーIDとみなして通常ログインフローへ
        addLog(`Proceeding to password step for username: ${emailOrUsername}`);
        setStep("password");
        return;
      }

      setIsLoading(true);
      try {
        const result = await initAuthFlow(emailOrUsername);

        if (result.flow_id) {
          addLog("Redirecting to challenge page");
          // 統一フロー: チャレンジページへ遷移
          const params = new URLSearchParams();
          params.set("type", "email");
          params.set("flow_id", result.flow_id);
          if (result.expires_at) params.set("expires_at", result.expires_at);
          if (result.next_resend_at)
            params.set("next_resend_at", result.next_resend_at);
          // アクションを指定しても良い (action=login)
          params.set("action", "login");

          router.push(`/challenge?${params.toString()}`);
        } else {
          // flow_idがない場合は通常フロー（パスワード入力）へ進む (後方互換またはフォールバック)
          addLog("No flow_id, proceeding to password step");
          setStep("password");
        }
      } catch (err) {
        console.error(err);
        // エラー時はとりあえずパスワード入力へ進める（フォールバック）
        setStep("password");
      } finally {
        setIsLoading(false);
      }
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
        const data = await login({ email: emailOrUsername, password });

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
