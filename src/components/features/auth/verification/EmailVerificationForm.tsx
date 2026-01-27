'use client';

import { FaCircleExclamation, FaRotateRight } from 'react-icons/fa6';
import OtpInput from '@/components/features/auth/OtpInput';

interface EmailVerificationFormProps {
  code: string;
  setCode: (code: string) => void;
  maskedEmail: string | null;
  error?: string;
  successMsg?: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onResend?: () => void;
  isResending?: boolean;
}

export default function EmailVerificationForm({
  code,
  setCode,
  maskedEmail,
  error,
  successMsg,
  isLoading,
  onSubmit,
  onResend,
  isResending = false,
}: EmailVerificationFormProps) {
  return (
    <div className="w-full">
      {error && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 text-center text-[11px] text-white p-2">
          <FaCircleExclamation className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      {successMsg && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-green-600/90 text-center text-[11px] text-white p-2">
          {successMsg}
        </p>
      )}

      <div className="mb-5 w-full">
        <p className="text-[13px] text-gray-300 mb-4 text-center">
          {maskedEmail ? (
            <>
              <span className="font-bold text-white">{maskedEmail}</span> 宛に
              <br />
            </>
          ) : (
             "登録されたメールアドレス宛に"
          )}
          認証コードを送信しました。
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <OtpInput
              value={code}
              onChange={setCode}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black disabled:opacity-50 hover:bg-gray-200 transition-colors"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? '認証中...' : '認証する'}
          </button>
        </form>
      </div>

      <div className="flex flex-col w-full items-center justify-center gap-4 mt-2">
        {onResend && (
            <button
              onClick={onResend}
              disabled={isResending}
              className="flex items-center text-xs text-amber-300 hover:text-amber-200 transition-colors disabled:opacity-50"
            >
              <FaRotateRight className={`mr-1 ${isResending ? 'animate-spin' : ''}`} />
              認証コードを再送信
            </button>
        )}
      </div>
    </div>
  );
}
