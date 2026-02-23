import { useState, useCallback } from "react";

export function useOtpInput() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // コード設定時にエラーをクリアするなどの簡単なバリデーションロジックを入れることも可能
  // コード設定時にエラーをクリアするなどの簡単なバリデーションロジックを入れることも可能
  const handleSetCode = useCallback((value: string) => {
    setCode(value);
    // Note: accessing 'error' state here in callback dependency might cause re-creation if error changes.
    // However, setError is safe to call even if we don't depend on 'error' value,
    // but here we check 'if (error)'.
    // To be safe and stable, better to use functional update or just set error to empty string blindly?
    // Or just depend on [error].
    // Actually, simply clearing error blindly is fine and stable.
    setError((prev) => (prev ? "" : prev));
  }, []);

  return {
    code,
    setCode: handleSetCode,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    isLoading,
    setIsLoading,
  };
}
