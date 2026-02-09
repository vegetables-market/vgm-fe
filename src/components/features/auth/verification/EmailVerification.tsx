'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAuth, AuthMethod, resendCode } from '@/services/authService';
import { getErrorMessage, handleGlobalError } from '@/lib/api/error-handler';
import { useAuth } from '@/context/AuthContext';
import EmailVerificationForm from './EmailVerificationForm';

interface EmailVerificationProps {
  flowId: string;
  expiresAt?: string;
  nextResendAt?: string;
  action?: string;
  redirectTo?: string;
  maskedEmail?: string;
}

export default function EmailVerification({ flowId, expiresAt, nextResendAt, action, redirectTo, maskedEmail: propMaskedEmail }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(propMaskedEmail || null);
  
  // 有効期限の残り時間（秒）
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  // 再送信クールダウン（秒）
  const [resendCooldown, setResendCooldown] = useState(0);

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

  // 有効期限タイマー
  useEffect(() => {
    if (!expiresAt) return;
    
    const calculateTimeLeft = () => {
        const end = new Date(expiresAt).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        return diff;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        if (remaining <= 0) {
            clearInterval(timer);
        }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // 再送信クールダウンタイマー (サーバー指定時刻ベース)
  useEffect(() => {
    if (!nextResendAt) {
        setResendCooldown(0);
        return;
    }
    
    const calculateCooldown = () => {
        const end = new Date(nextResendAt).getTime();
        const now = new Date().getTime();
        return Math.max(0, Math.floor((end - now) / 1000));
    };

    const initial = calculateCooldown();
    setResendCooldown(initial);
    
    // カウントダウン開始
    if (initial > 0) {
        const timer = setInterval(() => {
            const remaining = calculateCooldown();
            setResendCooldown(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [nextResendAt]);


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
      const data = await verifyAuth({
        method: AuthMethod.EMAIL,
        identifier: flowId,
        code,
        action
      });
      addLog(`Challenge successful: ${JSON.stringify(data)}`);

      if ((data as any).action_token && redirectTo) {
          // Action Token Flow
          const separator = redirectTo.includes('?') ? '&' : '?';
          router.push(`${redirectTo}${separator}action_token=${(data as any).action_token}`);
          return;
      }

      if (data.user) {
        authLogin(data.user);
        localStorage.removeItem('vgm_masked_email');
        const safeRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/';
        router.push(safeRedirect);
      } else {
        // 新規ユーザー -> 登録画面へ
        const targetEmail = (data as any).email || "";
        router.push(`/signup?email=${encodeURIComponent(targetEmail)}&flow_id=${flowId}&verified=true`);
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      handleGlobalError(err, router);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;

    setIsResending(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = await resendCode({ flow_id: flowId });
      addLog(`Resend successful. New flow_id: ${data.flow_id}`);
      setSuccessMsg('認証コードを再送信しました。');
      
      // レスポンスに含まれる next_resend_at をURLに反映させることで
      // 上記のuseEffectが発火し、クールダウンがセットされる
      const params = new URLSearchParams();
      params.set('type', 'email');
      params.set('flow_id', data.flow_id);
      if (data.expires_at) params.set('expires_at', data.expires_at);
      if (data.next_resend_at) params.set('next_resend_at', data.next_resend_at);
      if (action) params.set('action', action);
      if (redirectTo) params.set('redirect_to', redirectTo);
      router.replace(`/challenge?${params.toString()}`);
    } catch (err: any) {
      // 再送信制限エラーの場合
      if (err.info?.error === 'RESEND_LIMIT_EXCEEDED' || err.message?.includes('再送信回数の上限')) {
        setError('再送信回数の上限に達しました。ログイン画面に戻ります。');
        setTimeout(() => {
            router.push('/login');
        }, 3000);
        return;
      }

      const message = getErrorMessage(err);
      setError(message);
      // レート制限の場合もメッセージ表示のみ
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
      timeLeft={timeLeft}
      resendCooldown={resendCooldown}
    />
  );
}
