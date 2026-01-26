'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCircleExclamation } from 'react-icons/fa6';
import SocialLoginButtons from '@/components/features/auth/SocialLoginButtons';
import { login } from '@/services/authService';
import { getErrorMessage, handleGlobalError } from '@/lib/api/error-handler';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const addLog = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ステップ1: ユーザーID入力後
    if (step === 'email') {
      if (!emailOrUsername) {
        setError('メールアドレスまたはユーザーIDを入力してください。');
        return;
      }

      setIsLoading(true);
      addLog(`Checking device status for: ${emailOrUsername}`);
      try {
        // パスワードなしで一度ログインAPIを叩く
        const data = await login({ username: emailOrUsername });
        addLog(`Check response: ${data.status}`);

        if (data.require_verification && data.flow_id) {
          // 既知の端末なら直接チャレンジ画面へ
          addLog('Known device. Redirecting to challenge.');
          if (data.masked_email) {
            localStorage.setItem('vgm_masked_email', data.masked_email);
          }
          router.push(`/challenge?flow_id=${data.flow_id}`);
        } else {
          // 未知の端末ならパスワード入力を求める
          addLog('Unknown device. Password required.');
          setStep('password');
        }
      } catch (err: any) {
        // ユーザーが見つからない場合などもパスワード入力へ進ませる（存在秘匿のため）
        addLog(`Check failed: ${err.message}. Falling back to password.`);
        setStep('password');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ステップ2: パスワード入力後
    if (step === 'password') {
      if (!password) {
        setError('パスワードを入力してください。');
        return;
      }

      setIsLoading(true);
      addLog(`Attempting login with password for: ${emailOrUsername}`);
      try {
        const data = await login({ username: emailOrUsername, password });

        if (data.require_verification) {
          if (data.flow_id) {
            // 認証が必要で、flow_idがある場合（パスワード正解、または未知の端末）
            addLog('Verification required after password check.');
            if (data.masked_email) {
              localStorage.setItem('vgm_masked_email', data.masked_email);
            }
            router.push(`/challenge?flow_id=${data.flow_id}`);
          } else {
            // 認証が必要だが、flow_idがない場合（パスワード間違いなど）
            // バックエンドが flow_id を返さないケースは、パスワード間違いとみなす
            addLog('Login failed: Invalid credentials.');
            setError('メールアドレス、ユーザーIDまたはパスワードが間違っています。');
          }
        } else if (data.user) {
          addLog('Login successful!');
          authLogin(data.user);
          router.push('/');
        }
      } catch (err: any) {
        const message = getErrorMessage(err);
        setError(message);
        handleGlobalError(err, router);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
      <div className="flex w-125 flex-col items-center rounded-2xl bg-[#121212] pt-8 pb-12">
        <div className="flex w-75 flex-col items-center">
          <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold text-white">
            ログイン
          </h2>

          <SocialLoginButtons
            mode="login"
            onProviderClick={(id) => addLog(`Social login clicked: ${id}`)}
          />

          <div className="relative my-4 w-full">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
            <div className="relative flex justify-center text-sm"><span className="cursor-default bg-[#121212] px-2 text-gray-400">または</span></div>
          </div>

          {error && (
            <p className="mb-2 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 text-center text-[11px] text-white p-2">
              <FaCircleExclamation className="mr-1 flex-shrink-0" />
              {error}
            </p>
          )}

          <div className="mb-3 w-75">
            <form onSubmit={handleSubmit}>
              <div className="mb-2 w-full"><span className="cursor-default text-[12px] font-bold text-white">メールアドレスまたはユーザーID</span></div>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="メールアドレスまたはユーザーID"
                className="mb-3 h-9 w-full rounded-lg border-2 !border-white/70 bg-black pl-3 text-sm transition-colors duration-300 outline-none focus:!border-white"
                disabled={step === 'password' || isLoading}
              />

              {step === 'password' && (
                <div className="mb-3">
                  <div className="mb-2 w-full"><span className="cursor-default text-[12px] font-bold text-white">パスワード</span></div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード"
                    className="mb-3 h-9 w-full rounded-lg border-2 !border-white/70 bg-black pl-3 text-sm transition-colors duration-300 outline-none focus:!border-white"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              )}

              <button type="submit" className="h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black disabled:opacity-50" disabled={isLoading}>
                {isLoading ? '処理中...' : step === 'email' ? '次へ' : 'ログイン'}
              </button>
            </form>
          </div>

          <div className="flex w-full items-center justify-center">
            <span className="mr-1 cursor-default text-xs text-[#b3b3b3]">アカウントを</span>
            <Link href="/signup" className="text-xs text-white underline">新規登録する</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
