"use client";

import { FaArrowRotateRight, FaCircleExclamation, FaCircleCheck } from "react-icons/fa6";

type VerificationInputFormProps = {
  code: string;
  setCode: (code: string) => void;
  emailDisplay?: string;
  description?: React.ReactNode;
  error?: string;
  successMsg?: string;
  isLoading?: boolean;
  isResending?: boolean;
  timeLeft?: number | null;
  resendCooldown?: number | null;
  onResend?: () => void;
  onSubmit: (e?: React.FormEvent) => void;
};

export default function VerificationInputForm({
  code,
  setCode,
  emailDisplay,
  description,
  error,
  successMsg,
  isLoading,
  isResending,
  timeLeft,
  resendCooldown,
  onResend,
  onSubmit,
}: VerificationInputFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && code.length === 6 && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      {emailDisplay && (
        <div className="mb-4 text-center">
          <p className="text-sm font-bold text-white">{emailDisplay}</p>
        </div>
      )}

      {description && <div className="mb-6">{description}</div>}

      {/* Input Field */}
      <div className="relative mb-6 w-full max-w-[280px]">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={6}
          placeholder="000000"
          className="h-12 w-full rounded-lg border-2 border-white/20 bg-black text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition-colors duration-300 focus:border-white"
          autoFocus
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 flex items-center text-sm text-red-400">
          <FaCircleExclamation className="mr-2 h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 flex items-center text-sm text-green-400">
          <FaCircleCheck className="mr-2 h-4 w-4" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Verify Button */}
      <button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className={`relative h-11 w-full max-w-[280px] overflow-hidden rounded-full transition-all duration-300 ${
          isLoading || code.length !== 6
            ? "cursor-not-allowed bg-gray-600 text-gray-400"
            : "cursor-pointer bg-white text-black hover:bg-gray-200 hover:shadow-lg hover:shadow-white/20"
        }`}
      >
        <span className="relative z-10 flex items-center justify-center font-bold">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          ) : (
            "認証する"
          )}
        </span>
      </button>

      {/* Footer Info */}
      <div className="mt-6 flex flex-col items-center gap-2 text-xs text-gray-400">
        {onResend && (
          <div className="flex items-center gap-2">
            {resendCooldown && resendCooldown > 0 ? (
              <span>再送可能まで: {resendCooldown}秒</span>
            ) : (
              <button
                type="button"
                onClick={onResend}
                disabled={isResending}
                className="flex items-center gap-1 hover:text-white hover:underline disabled:opacity-50"
              >
                <FaArrowRotateRight
                  className={isResending ? "animate-spin" : ""}
                />
                コードを再送する
              </button>
            )}
          </div>
        )}
        
        {timeLeft != null && timeLeft > 0 && (
          <div className="text-gray-500">
            有効期限: {Math.floor(timeLeft / 60)}分{timeLeft % 60}秒
          </div>
        )}
      </div>
    </form>
  );
}
