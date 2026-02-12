"use client";

import { useOtpDigitInput } from "@/hooks/auth/shared/useOtpDigitInput";
import type { OtpInputProps } from "@/types/auth/otp-input";

export default function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
}: OtpInputProps) {
  const { otp, setInputRef, handleChange, handleKeyDown, handlePaste } =
    useOtpDigitInput({
      length,
      value,
      onChange,
    });

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={setInputRef(index)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="h-12 w-10 rounded-md border border-zinc-700 bg-zinc-900 text-center text-xl font-bold text-white transition-colors focus:border-amber-300 focus:outline-none disabled:opacity-50"
        />
      ))}
    </div>
  );
}
