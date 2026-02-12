"use client";

import React from "react";
import { FaCircleExclamation, FaRotateRight } from "react-icons/fa6";
import OtpInput from "@/components/features3/auth/OtpInput";

type VerificationCodeFormProps = {
  code: string;
  setCode: (code: string) => void;
  emailDisplay?: string | null;
  error?: string;
  successMsg?: string;
  isLoading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onResend?: () => void;
  isResending?: boolean;
  timeLeft?: number | null;
  resendCooldown?: number;
};

export default function VerificationCodeForm({
  code,
  setCode,
  emailDisplay,
  error,
  successMsg,
  isLoading,
  onSubmit,
  onResend,
  isResending = false,
  timeLeft,
  resendCooldown = 0,
}: VerificationCodeFormProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      {error && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 p-2 text-center text-[11px] text-white">
          <FaCircleExclamation className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      {successMsg && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-green-600/90 p-2 text-center text-[11px] text-white">
          {successMsg}
        </p>
      )}

      <div className="mb-5 w-full">
        <p className="mb-2 text-center text-[13px] text-gray-300">
          {emailDisplay ? (
            <>
              <span className="font-bold text-white">{emailDisplay}</span> 宛に
              <br />
            </>
          ) : (
            <>
              登録されたメールアドレス宛に
              <br />
            </>
          )}
          認証コードを送信しました。
        </p>

        {timeLeft !== undefined && timeLeft !== null && (
          <p
            className={`mb-4 text-center font-mono text-xs ${timeLeft < 60 ? "text-red-500" : "text-gray-400"}`}
          >
            有効期限: {formatTime(timeLeft)}
          </p>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <OtpInput value={code} onChange={setCode} disabled={isLoading} />
          </div>

          <button
            type="submit"
            className="h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black transition-colors hover:bg-gray-200 disabled:opacity-50"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "認証中..." : "認証する"}
          </button>
        </form>
      </div>

      <div className="mt-2 flex w-full flex-col items-center justify-center gap-4">
        {onResend && (
          <button
            onClick={onResend}
            disabled={isResending || resendCooldown > 0}
            className="flex items-center text-xs text-amber-300 transition-colors hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaRotateRight
              className={`mr-1 ${isResending ? "animate-spin" : ""}`}
            />
            {resendCooldown > 0
              ? `再送まで ${resendCooldown}秒`
              : "認証コードを再送"}
          </button>
        )}
      </div>
    </div>
  );
}

