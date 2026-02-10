'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from "@/lib/api/fetch";

interface NotificationSettings {
  emailNotifications: boolean;
  favoritePriceDrop: boolean;
  newMessage: boolean;
  transactionUpdates: boolean;
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    favoritePriceDrop: true,
    newMessage: true,
    transactionUpdates: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchApi<NotificationSettings>('/v1/user/notification-settings', {
      credentials: 'include'
    })
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      await fetchApi('/v1/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
        credentials: 'include'
      });
      setMessage('設定を保存しました');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">通知設定</h1>

      {message && (
        <div className={`mb-4 p-4 rounded ${message.includes('失敗') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* メール通知全体 */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-800">メール通知</h3>
            <p className="text-sm text-gray-600">すべてのメール通知のON/OFF</p>
          </div>
          <button
            onClick={() => handleToggle('emailNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* お気に入り値下げ通知 */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-800">お気に入り在庫の値下げ通知</h3>
            <p className="text-sm text-gray-600">お気に入りに登録した在庫が値下げされた時に通知</p>
          </div>
          <button
            onClick={() => handleToggle('favoritePriceDrop')}
            disabled={!settings.emailNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.favoritePriceDrop && settings.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
            } ${!settings.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.favoritePriceDrop ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 新着メッセージ通知 */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-800">新着メッセージ通知</h3>
            <p className="text-sm text-gray-600">新しいメッセージを受信した時に通知</p>
          </div>
          <button
            onClick={() => handleToggle('newMessage')}
            disabled={!settings.emailNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.newMessage && settings.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
            } ${!settings.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.newMessage ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 取引関連通知 */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">取引関連の更新通知</h3>
            <p className="text-sm text-gray-600">購入、発送、受取などの取引に関する通知</p>
          </div>
          <button
            onClick={() => handleToggle('transactionUpdates')}
            disabled={!settings.emailNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.transactionUpdates && settings.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
            } ${!settings.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.transactionUpdates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {saving ? '保存中...' : '設定を保存'}
        </button>
      </div>
    </div>
  );
}
