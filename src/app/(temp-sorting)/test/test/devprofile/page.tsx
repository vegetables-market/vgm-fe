'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserById, ApiError } from '@/lib/api';

interface UserData {
  id: number;
  username: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // localStorageからユーザー情報を取得
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(storedUser) as UserData;

        // バックエンドから最新のユーザー情報を取得
        const response = await getUserById(user.id);

        if (response.success && response.userId && response.username) {
          setUserData({
            id: response.userId,
            username: response.username,
            email: response.email || '',
          });
        } else {
          setError('ユーザー情報の取得に失敗しました');
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('エラーが発生しました');
        }
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-red-600 mb-4">{error}</div>
          <Link
            href="/login"
            className="text-blue-500 hover:underline"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">プロフィール</h1>
            <Link
              href="/vgm-fe/public"
              className="text-blue-500 hover:underline text-sm"
            >
              ホームへ戻る
            </Link>
          </div>

          {userData && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">
                  ユーザーID
                </h2>
                <p className="text-lg text-gray-800">{userData.id}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">
                  ユーザー名
                </h2>
                <p className="text-lg text-gray-800">{userData.username}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">
                  メールアドレス
                </h2>
                <p className="text-lg text-gray-800">{userData.email}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">
                  セキュリティ
                </h2>
                <Link
                  href="/settings/totp"
                  className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  二要素認証 (TOTP) 設定
                </Link>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">
                  決済機能
                </h2>
                <Link
                  href="/payment-test"
                  className="inline-block bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  決済機能テストページ
                </Link>
                <p className="text-xs text-gray-500 mt-2">
                  商品の出品・購入・決済のテストができます
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  ログアウト
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
