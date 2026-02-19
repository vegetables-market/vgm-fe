import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  RefCallback,
} from "react";

type UseOtpDigitInputParams = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
};

/**
 * OTP入力のロジックを管理するカスタムフック
 * - 位置ベースの編集（中間の削除でもシフトしない）
 * - 空きスロットへの自動リダイレクト
 * - コピペ、矢印キー、Backspace/Delete/Enter 対応
 */
export function useOtpDigitInput({
  length,
  value,
  onChange,
  onComplete,
}: UseOtpDigitInputParams) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- Internal state: n-element array ---
  const [digits, setDigits] = useState<string[]>(() =>
    parseValue(value, length),
  );
  const digitsRef = useRef(digits);

  // Keep ref in sync
  useEffect(() => {
    digitsRef.current = digits;
  }, [digits]);

  // Sync parent value → internal (external reset, etc.)
  useEffect(() => {
    const currentCompact = digitsRef.current.join("");
    if (value !== currentCompact) {
      const newDigits = parseValue(value, length);
      setDigits(newDigits);
      digitsRef.current = newDigits;
    }
  }, [value, length]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // --- Helpers ---

  const syncToParent = useCallback(
    (nextDigits: string[]) => {
      digitsRef.current = nextDigits;
      setDigits(nextDigits);
      onChange(nextDigits.join(""));
    },
    [onChange],
  );

  const setDigitAt = useCallback(
    (index: number, digit: string) => {
      const next = [...digitsRef.current];
      next[index] = digit;
      syncToParent(next);
    },
    [syncToParent],
  );

  const focusInput = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, inputRefs.current.length - 1));
    requestAnimationFrame(() => {
      inputRefs.current[clamped]?.focus();
      inputRefs.current[clamped]?.select();
    });
  }, []);

  // --- Ref callback ---

  const setInputRef = useCallback(
    (index: number): RefCallback<HTMLInputElement> =>
      (el) => {
        inputRefs.current[index] = el;
      },
    [],
  );

  // --- Event Handlers ---

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (!raw) return;

      const digit = raw.slice(-1);
      const current = digitsRef.current;

      // If current box is filled, redirect to first empty slot
      let targetIndex = index;
      if (current[index]) {
        const emptyIndex = current.findIndex((d) => !d);
        if (emptyIndex === -1) return; // All filled
        targetIndex = emptyIndex;
      }

      setDigitAt(targetIndex, digit);

      // Auto-advance to next empty slot
      // Note: current still has old state, so check excluding targetIndex
      const nextEmpty = current.findIndex(
        (d, i) => i > targetIndex && !d && i !== targetIndex,
      );
      if (nextEmpty !== -1) {
        focusInput(nextEmpty);
      } else {
        focusInput(Math.min(targetIndex + 1, length - 1));
      }
    },
    [setDigitAt, focusInput, length],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      const currentDigit = digitsRef.current[index];

      switch (e.key) {
        case "Backspace":
          e.preventDefault();
          if (currentDigit) {
            setDigitAt(index, "");
          } else if (index > 0) {
            setDigitAt(index - 1, "");
            focusInput(index - 1);
          }
          break;

        case "Delete":
          e.preventDefault();
          setDigitAt(index, "");
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (index > 0) focusInput(index - 1);
          break;

        case "ArrowRight":
          e.preventDefault();
          if (index < length - 1) focusInput(index + 1);
          break;

        case "Enter":
          e.preventDefault();
          if (
            digitsRef.current.join("").length === length &&
            onComplete
          ) {
            onComplete();
          }
          break;

        default:
          break;
      }
    },
    [setDigitAt, focusInput, length, onComplete],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>, index: number) => {
      e.preventDefault();
      const pastedDigits = e.clipboardData
        .getData("text/plain")
        .replace(/\D/g, "")
        .slice(0, length - index)
        .split("");

      if (!pastedDigits.length) return;

      const next = [...digitsRef.current];
      pastedDigits.forEach((d, offset) => {
        next[index + offset] = d;
      });
      syncToParent(next);

      const nextIndex = Math.min(index + pastedDigits.length, length - 1);
      focusInput(nextIndex);
    },
    [syncToParent, focusInput, length],
  );

  const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return {
    digits,
    setInputRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
  };
}

/** Parse a compact value string into an n-element array */
function parseValue(value: string, length: number): string[] {
  const arr = Array(length).fill("");
  for (let i = 0; i < Math.min(value.length, length); i++) {
    if (/\d/.test(value[i])) {
      arr[i] = value[i];
    }
  }
  return arr;
}
