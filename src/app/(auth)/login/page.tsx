'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaCircleExclamation } from 'react-icons/fa6';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ステップ1: 「次へ」ボタンが押されたとき
    if (step === 'email') {
      if (!emailOrUsername) {
        setError('メールアドレスまたはユーザーIDを入力してください。');
        return;
      }
      setStep('password'); // 次のステップ（パスワード入力）へ
      return;
    }

    // ステップ2: 「ログイン」ボタンが押されたとき
    if (!password) {
      setError('パスワードを入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      // AuthContextのlogin関数を使用
      // await login(emailOrUsername, password);
      console.log('ログイン成功');

      // ログイン成功後、メインページにリダイレクト
      router.push('/');
    } catch (error: any) {
      console.error('ログイン失敗:', error);
      setError(
        error.message ||
          'ログインに失敗しました。メールアドレスとパスワードを確認してください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
      <div className="flex w-125 flex-col items-center rounded-2xl bg-[#121212] pt-8 pb-12">
        <div className="flex w-75 flex-col items-center">
          <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold text-white">
            ログイン
          </h2>
          <div className="mb-4 flex w-full flex-col gap-2">
            {/* Spotify */}
            <button className="relative flex h-12 w-full cursor-pointer items-center justify-center rounded-full border-1 border-zinc-300 bg-black font-bold text-white">
              <div className="absolute left-8">
                <div className="relative mr-2 flex h-6 w-6 items-center justify-center">
                  <div className="absolute h-5 w-5 rounded-full bg-black"></div>
                  <Image
                    src="/serviceLogo/logo-spotify-music.svg"
                    alt=""
                    width={361}
                    height={361}
                    className="h-full w-full object-contain drop-shadow-xl/100"
                  />
                </div>
              </div>
              <span className="text-sm text-white">Spotifyでログイン</span>
            </button>

            {/* AppleMusic */}
            <button className="relative flex h-12 w-full cursor-pointer items-center justify-center rounded-full border-1 border-zinc-300 bg-black font-bold text-white">
              <div className="absolute left-8 mr-2 flex h-6 w-6 items-center justify-center">
                <Image
                  src="/serviceLogo/logo-apple-music.svg"
                  alt=""
                  width={361}
                  height={361}
                  className="h-full w-full object-contain drop-shadow-xl/100"
                />
              </div>
              <span className="text-sm text-white">AppleMusicでログイン</span>
            </button>
          </div>

          {/*棒*/}
          <div className="relative mb-4 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="cursor-default bg-[#121212] px-2 text-gray-400">
                または
              </span>
            </div>
          </div>

          {error && (
            <p className="mb-2 flex h-8 w-full items-center justify-center rounded-xs bg-red-600 text-center text-[11px]">
              <FaCircleExclamation className="mr-1" />
              {error}
            </p>
          )}

          <div className="mb-3 w-75">
            <form onSubmit={handleSubmit}>
              <div className="mb-2 w-full">
                <span className="cursor-default text-[12px] font-bold text-white">
                  メールアドレスまたはユーザーID
                </span>
              </div>

              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="メールアドレスまたはユーザーID"
                className="mb-3 h-9 w-full rounded-lg border-2 !border-white/70 bg-black pl-3 text-sm transition-colors duration-300 outline-none focus:!border-white"
              />

              {step === 'password' && (
                <div className="mb-3">
                  <div className="mb-2 w-full">
                    <span className="cursor-default text-[12px] font-bold text-white">
                      パスワード
                    </span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード"
                    className="mb-3 h-9 w-full rounded-lg border-2 !border-white/70 bg-black pl-3 text-sm transition-colors duration-300 outline-none focus:!border-white"
                    autoFocus
                  />
                </div>
              )}

              <button
                type="submit"
                className="h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black"
              >
                {isLoading
                  ? '処理中...'
                  : step === 'email'
                    ? '次へ'
                    : 'ログイン'}
              </button>
            </form>
          </div>

          <div className="flex w-full items-center justify-center">
            <span className="mr-1 cursor-default text-xs text-[#b3b3b3]">
              アカウントを
            </span>
            <Link href="/signup" className="text-xs text-white underline">
              新規登録する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
