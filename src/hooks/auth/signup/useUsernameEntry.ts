import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { checkUsername } from "@/services/auth/check-username";
import { getInitialUsernameSuggestions } from "@/services/auth/get-initial-username-suggestions";
import { isValidUsernameFormat } from "@/services/auth/username-validation";

type UsernameCheckResult = {
  available: boolean;
  message?: string;
  suggestions?: string[];
};

type UseUsernameEntryParams = {
  username: string;
  setUsername: (value: string) => void;
  onNext: () => void;
};

const DEFAULT_USERNAME_ERROR = "このユーザーIDは使用できません。";

export function useUsernameEntry({
  username,
  setUsername,
  onNext,
}: UseUsernameEntryParams) {
  const [showError, setShowError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkCache = useRef<Map<string, UsernameCheckResult>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const isFormatValid = useMemo(() => isValidUsernameFormat(username), [username]);

  useEffect(() => {
    if (username || suggestions.length > 0) return;

    const fetchInitialSuggestions = async () => {
      try {
        const result = await getInitialUsernameSuggestions();
        if (result.suggestions && result.suggestions.length > 0) {
          setSuggestions(result.suggestions);
        }
      } catch (error) {
        console.error("Failed to fetch initial suggestions", error);
      }
    };

    fetchInitialSuggestions();
  }, [username, suggestions.length]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

    async function checkAvailability(value: string) {
    if (!value || value.length < 3) {
      setChecking(false);
      setIsAvailable(null);
      return;
    }

    if (checkCache.current.has(value)) {
      const cached = checkCache.current.get(value)!;
      setChecking(false);
      setSuggestions(cached.suggestions || []);

      if (!cached.available) {
        setUsernameError(cached.message || DEFAULT_USERNAME_ERROR);
        setIsAvailable(false);
      } else {
        setUsernameError("");
        setIsAvailable(true);
      }
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setChecking(true);
    // Don't clear previous results while checking to avoid UI flicker
    // setUsernameError("");
    // setSuggestions([]);
    // setIsAvailable(null);

    try {
      const result = await checkUsername(value);
      if (controller.signal.aborted) return;

      checkCache.current.set(value, result);
      setSuggestions(result.suggestions || []);

      if (!result.available) {
        setUsernameError(result.message || DEFAULT_USERNAME_ERROR);
        setIsAvailable(false);
      } else {
        setUsernameError("");
        setIsAvailable(true);
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error("Username check failed", error);
    } finally {
      if (!controller.signal.aborted) {
        setChecking(false);
        abortControllerRef.current = null;
      }
    }
  }

  const debouncedCheck = useDebouncedCallback(checkAvailability, 500);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setShowError(false);

    if (isValidUsernameFormat(value)) {
      setChecking(true);
      debouncedCheck(value);
    } else {
      // Clear checking state and results if format is invalid
      setChecking(false);
      setUsernameError("");
      setSuggestions([]);
      setIsAvailable(null);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setUsername(suggestion);
    setShowError(false);
    setUsernameError("");
    setSuggestions([]);
    setIsAvailable(true);
    setChecking(false);
    checkCache.current.set(suggestion, { available: true });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormatValid) {
      setShowError(true);
      return;
    }

    if (checking || usernameError) return;
    onNext();
  };

  return {
    showError,
    checking,
    usernameError,
    suggestions,
    isAvailable,
    isFormatValid,
    handleUsernameChange,
    applySuggestion,
    handleSubmit,
  };
}
