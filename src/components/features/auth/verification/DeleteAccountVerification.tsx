'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api/api-client';

interface DeleteAccountVerificationProps {
  flowId: string;
}

export default function DeleteAccountVerification({ flowId }: DeleteAccountVerificationProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError('認証コードは6桁です。');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchApi<{ success: boolean; message: string }>(
        '/v1/user/account/delete/confirm',
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ flowId, code })
        }
      );

      if (data.success) {
        logout();
        router.push('/?deleted=true');
      } else {
        setError('認証に失敗しました');
      }
    } catch (err: any) {
      setError(err.message || '通信エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // 数字のみ、6桁まで
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericValue);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4 rounded-lg bg-red-900/30 p-4 text-center">
        <p className="text-sm text-red-300">
          ⚠️ この操作は取り消せません
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          メールに送信された認証コードを入力してください
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-600/90 p-2 text-center text-xs text-white">
          {error}
        </p>
      )}

      <div className="mb-6">
        <input
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="認証コード（6桁）"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-center text-xl tracking-widest text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
          maxLength={6}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="w-full rounded-lg bg-red-600 py-3 text-base font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? '処理中...' : 'アカウントを削除する'}
      </button>

      <p className="mt-4 text-center text-xs text-zinc-500">
        コードの有効期限は10分間です
      </p>
    </form>
  );
}
