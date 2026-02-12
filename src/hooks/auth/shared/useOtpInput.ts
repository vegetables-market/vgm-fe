import { useState } from "react";

export function useOtpInput() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // コード設定時にエラーをクリアするなどの簡単なバリデーションロジックを入れることも可能
  const handleSetCode = (value: string) => {
    setCode(value);
    if (error) setError("");
  };

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
