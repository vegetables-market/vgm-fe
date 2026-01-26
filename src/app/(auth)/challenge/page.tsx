'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCircleExclamation, FaRotateRight } from 'react-icons/fa6';
import { verifyChallenge, resendCode } from '@/services/authService';
import { getErrorMessage, handleGlobalError } from '@/lib/api/error-handler';
import OtpInput from '@/components/features/auth/OtpInput';
import { useAuth } from '@/context/AuthContext';

function ChallengeContent() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flow_id');
  const { login: authLogin } = useAuth();

  const addLog = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  useEffect(() => {
    if (!flowId) {
      setError('無効なリクエストです。最初からやり直してください。');
    }
    // localStorageからmasked_emailを取得
    const storedEmail = localStorage.getItem('vgm_masked_email');
    if (storedEmail) {
      setMaskedEmail(storedEmail);
    }
  }, [flowId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!flowId) return;
    if (code.length !== 6) {
      setError('認証コードは6桁です。');
      return;
    }

    setIsLoading(true);
    setError('');
    addLog(`Submitting challenge for flow_id: ${flowId}`);

    try {
      const data = await verifyChallenge({ flow_id: flowId, code });
      addLog(`Challenge successful: ${JSON.stringify(data)}`);

      if (data.user) {
        authLogin(data.user);
        // 認証完了後はmasked_emailを削除
        localStorage.removeItem('vgm_masked_email');
      }

      router.push('/');
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      handleGlobalError(err, router);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!flowId || isResending) return;

    setIsResending(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = await resendCode({ flow_id: flowId });
      addLog(`Resend successful. New flow_id: ${data.flow_id}`);
      setSuccessMsg('認証コードを再送信しました。');

      // URLのflow_idを更新（リロードなしで）
      const newUrl = `/challenge?flow_id=${data.flow_id}`;
      router.replace(newUrl);
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
      <div className="flex w-125 flex-col items-center rounded-2xl bg-[#121212] pt-8 pb-12">
        <div className="flex w-75 flex-col items-center">
          <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold text-white">
            セキュリティ確認
          </h2>

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

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <OtpInput
                  value={code}
                  onChange={setCode}
                  disabled={!flowId || isLoading}
                />
              </div>

              <button
                type="submit"
                className="h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black disabled:opacity-50 hover:bg-gray-200 transition-colors"
                disabled={!flowId || isLoading || code.length !== 6}
              >
                {isLoading ? '認証中...' : '認証する'}
              </button>
            </form>
          </div>

          <div className="flex flex-col w-full items-center justify-center gap-4 mt-2">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center text-xs text-amber-300 hover:text-amber-200 transition-colors disabled:opacity-50"
            >
              <FaRotateRight className={`mr-1 ${isResending ? 'animate-spin' : ''}`} />
              認証コードを再送信
            </button>

            <button
              onClick={() => router.push('/login')}
              className="text-xs text-zinc-500 underline cursor-pointer bg-transparent border-none hover:text-zinc-300 transition-colors"
            >
              ログイン画面に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChallengePage() {
  return (
    <Suspense fallback={<div className="bg-black h-screen w-screen flex items-center justify-center text-white">Loading...</div>}>
      <ChallengeContent />
    </Suspense>
  );
}
