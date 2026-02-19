import { useOtpDigitInput } from "@/hooks/auth/shared/useOtpDigitInput";

const OTP_LENGTH = 6;

type VerificationInputProps = {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  isLoading?: boolean;
  className?: string;
  autoComplete?: string;
};

/**
 * 6桁OTP入力コンポーネント（UIのみ）
 * ロジックは useOtpDigitInput フックに委譲
 */
export default function VerificationInput({
  value,
  onChange,
  onEnter,
  isLoading,
  className,
  autoComplete,
}: VerificationInputProps) {
  const { digits, setInputRef, handleChange, handleKeyDown, handlePaste, handleFocus } =
    useOtpDigitInput({
      length: OTP_LENGTH,
      value,
      onChange,
      onComplete: onEnter,
    });

  return (
    <div
      className={`mb-6 flex w-full justify-between ${className || ""}`}
      role="group"
      aria-label="認証コード入力"
    >
      {digits.map((digit, i) => {
        const isFilled = digit !== "";

        return (
          <input
            key={i}
            name={`verification-code-${i}`}
            ref={setInputRef(i)}
            type="text"
            inputMode="numeric"
            autoComplete={autoComplete || (i === 0 ? "one-time-code" : "off")}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            onFocus={handleFocus}
            disabled={isLoading}
            aria-label={`認証コード ${i + 1}桁目`}
            className={[
              // Base
              "h-12 w-10 rounded-lg border-2 text-center text-2xl font-bold outline-none",
              "caret-transparent transition-colors duration-300 select-none",
              // Default state
              "border-border bg-input text-muted-foreground",
              // Filled state
              isFilled && "border-muted-foreground text-foreground",
              // Focus state
              "focus:border-muted-foreground focus:text-foreground",
              // Loading / disabled
              isLoading && "cursor-not-allowed opacity-50",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        );
      })}
    </div>
  );
}
