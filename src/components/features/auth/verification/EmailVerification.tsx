'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyChallenge, resendCode } from '@/services/authService';
import { getErrorMessage, handleGlobalError } from '@/lib/api/error-handler';
import { useAuth } from '@/context/AuthContext';
import EmailVerificationForm from './EmailVerificationForm';

interface EmailVerificationProps {
  flowId: string;
}

export default function EmailVerification({ flowId }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const addLog = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  useEffect(() => {
    // localStorageからmasked_emailを取得
    const storedEmail = localStorage.getItem('vgm_masked_email');
    if (storedEmail) {
      setMaskedEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
    if (isResending) return;

    setIsResending(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = await resendCode({ flow_id: flowId });
      addLog(`Resend successful. New flow_id: ${data.flow_id}`);
      setSuccessMsg('認証コードを再送信しました。');

      const newUrl = `/challenge?type=email&flow_id=${data.flow_id}`;
      router.replace(newUrl);
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <EmailVerificationForm
      code={code}
      setCode={setCode}
      maskedEmail={maskedEmail}
      error={error}
      successMsg={successMsg}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onResend={handleResend}
      isResending={isResending}
    />
  );
}
