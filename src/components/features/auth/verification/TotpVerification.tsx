'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCircleExclamation } from 'react-icons/fa6';
import { verifyAuth, AuthMethod } from '@/services/authService';
import { getErrorMessage } from '@/lib/api/error-handler';
import OtpInput from '@/components/features/auth/OtpInput';
import { useAuth } from '@/context/AuthContext';

interface TotpVerificationProps {
  mfaToken: string;
  action?: string;
  redirectTo?: string;
}

export default function TotpVerification({ mfaToken, action, redirectTo }: TotpVerificationProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const addLog = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError('認証コードは6桁です。');
      return;
    }

    setIsLoading(true);
    setError('');
    addLog('Verifying MFA code...');

    try {
      const data = await verifyAuth({
          method: AuthMethod.TOTP,
          identifier: mfaToken,
          code,
          action
      });
      addLog(`MFA Verify response: ${data.status}`);

      if ((data as any).action_token && redirectTo) {
          // Action Token Flow
          const separator = redirectTo.includes('?') ? '&' : '?';
          router.push(`${redirectTo}${separator}action_token=${(data as any).action_token}`);
          return;
      }

      if (data.user) {
        addLog('MFA login successful!');
        authLogin(data.user);
        const safeRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/';
        router.push(safeRedirect);
      } else if (data.require_verification && data.flow_id) {
        // MFA後にさらにメール認証が必要な場合（まれなケース）
        router.push(`/challenge?type=email&flow_id=${data.flow_id}`);
      } else {
        setError('ログインに失敗しました。');
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message); // "Invalid verification code" など
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 text-center text-[11px] text-white p-2">
          <FaCircleExclamation className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      <div className="mb-5 w-full">
        <p className="text-[13px] text-gray-300 mb-4 text-center">
          認証アプリ（Authenticator）に表示されている<br />
          6桁のコードを入力してください。
        </p>

        <form onSubmit={handleSubmit}>
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
    </div>
  );
}
