'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, loginWithTotp, LoginRequest, ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // TOTP入力画面の状態
  const [showTotpInput, setShowTotpInput] = useState(false);
  const [totpCode, setTotpCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await login(formData);

      // TOTP必要な場合（success: falseでもrequireTotpがtrueならTOTP画面へ）
      if (response.requireTotp) {
        setShowTotpInput(true);
        setMessage('');  // メッセージをクリア
        setIsLoading(false);
        return;
      }

      // 通常ログイン成功
      if (response.success) {
        if (response.userId && response.username) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: response.userId,
              username: response.username,
              email: response.email,
            }),
          );
        }
        setMessage('ログインに成功しました！');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage('エラーが発生しました。もう一度お試しください。');
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await loginWithTotp({
        username: formData.username,
        password: formData.password,
        totpCode: totpCode,
      });

      if (response.success) {
        if (response.userId && response.username) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: response.userId,
              username: response.username,
              email: response.email,
            }),
          );
        }
        setMessage('ログインに成功しました！');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage('エラーが発生しました。もう一度お試しください。');
      }
      console.error('TOTP login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBackToLogin = () => {
    setShowTotpInput(false);
    setTotpCode('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ログイン
        </h1>

        {!showTotpInput ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ユーザー名
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.includes('成功')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit} className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-800">
                Google Authenticatorアプリに表示されている6桁のコードを入力してください。
              </p>
            </div>

            <div>
              <label
                htmlFor="totpCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                認証コード (6桁)
              </label>
              <input
                type="text"
                id="totpCode"
                value={totpCode}
                onChange={(e) =>
                  setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="123456"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
                disabled={isLoading}
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.includes('成功')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || totpCode.length !== 6}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '確認中...' : '確認してログイン'}
            </button>

            <button
              type="button"
              onClick={handleBackToLogin}
              disabled={isLoading}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none disabled:bg-gray-200"
            >
              戻る
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          アカウントをお持ちでないですか？{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}
