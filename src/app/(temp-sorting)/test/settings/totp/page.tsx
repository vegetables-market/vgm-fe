'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { enableTotp, verifyAndEnableTotp, disableTotp, ApiError } from '@/lib/api/api-auth';
import Image from 'next/image';

interface UserData {
  id: number;
  username: string;
  email: string;
}

export default function TotpSettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // TOTP有効化フロー
  const [step, setStep] = useState<'initial' | 'setup' | 'enabled'>('initial');
  const [secret, setSecret] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // TOTP無効化
  const [password, setPassword] = useState('');
  const [showDisableForm, setShowDisableForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser) as UserData;
    setUserData(user);
    setLoading(false);
  }, [router]);

  const handleEnableTotp = async () => {
    if (!userData) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await enableTotp({ userId: userData.id });

      if (response.success) {
        setSecret(response.secret || '');
        setQrCodeImage(response.qrCodeImage || '');
        setStep('setup');
        setMessage(response.message);
      } else {
        setError(response.message);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('エラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!userData) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await verifyAndEnableTotp({
        userId: userData.id,
        code: totpCode,
      });

      if (response.success) {
        setStep('enabled');
        setMessage('TOTP認証が有効化されました！');
        setTotpCode('');
      } else {
        setError(response.message);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('エラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTotp = async () => {
    if (!userData) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await disableTotp({
        userId: userData.id,
        password: password,
      });

      if (response.success) {
        setStep('initial');
        setMessage('TOTP認証を無効化しました');
        setPassword('');
        setShowDisableForm(false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('エラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">二要素認証 (TOTP)</h1>
            <Link href="/profile" className="text-blue-500 hover:underline text-sm">
              プロフィールへ戻る
            </Link>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {step === 'initial' && (
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h2 className="font-semibold text-blue-900 mb-2">TOTPとは？</h2>
                <p className="text-sm text-blue-800">
                  Time-based One-Time Password（TOTP）は、時間ベースのワンタイムパスワードです。
                  Google Authenticatorなどのアプリを使用して、30秒ごとに変わる6桁のコードを生成します。
                </p>
              </div>

              <button
                onClick={handleEnableTotp}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
              >
                {loading ? '処理中...' : 'TOTP認証を有効化'}
              </button>
            </div>
          )}

          {step === 'setup' && (
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h2 className="font-semibold text-green-900 mb-2">セットアップ手順</h2>
                <ol className="list-decimal list-inside text-sm text-green-800 space-y-1">
                  <li>メールに送信されたシークレットキーを確認</li>
                  <li>Google Authenticatorアプリで「+」をタップ</li>
                  <li>「セットアップキーを入力」を選択</li>
                  <li>アカウント名に「VGM - {userData?.username}」と入力</li>
                  <li>シークレットキーを入力</li>
                  <li>アプリに表示された6桁コードを下記に入力</li>
                </ol>
              </div>

              {qrCodeImage && (
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-sm text-gray-600">または、このQRコードをスキャン:</p>
                  <Image
                    src={`data:image/png;base64,${qrCodeImage}`}
                    alt="TOTP QR Code"
                    width={300}
                    height={300}
                    className="border-2 border-gray-300 rounded"
                  />
                </div>
              )}

              {secret && (
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">シークレットキー:</p>
                  <code className="text-lg font-mono bg-white px-3 py-2 rounded border block text-center">
                    {secret}
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    ※メールにも送信されています
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6桁の認証コードを入力
                </label>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={loading || totpCode.length !== 6}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
              >
                {loading ? '検証中...' : '確認して有効化'}
              </button>
            </div>
          )}

          {step === 'enabled' && (
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h2 className="font-semibold text-green-900 mb-2">TOTP認証が有効です</h2>
                <p className="text-sm text-green-800">
                  ログイン時に、Google Authenticatorアプリに表示される6桁のコードを入力してください。
                </p>
              </div>

              {!showDisableForm ? (
                <button
                  onClick={() => setShowDisableForm(true)}
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  TOTP認証を無効化
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <p className="text-sm text-yellow-800">
                      本人確認のため、パスワードを入力してください。
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      パスワード
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowDisableForm(false);
                        setPassword('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleDisableTotp}
                      disabled={loading || !password}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                    >
                      {loading ? '処理中...' : '無効化する'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
