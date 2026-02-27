import { useState, useCallback } from "react";

export function useOtpInput() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetCode = useCallback((value: string) => {
    setCode(value);
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
