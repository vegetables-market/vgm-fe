"use client";

import { usePasskey } from "@/hooks/auth/usePasskey";
import { useState } from "react";
import { FaFingerprint } from "react-icons/fa";

export default function PasskeySettingsPage() {
    const { registerPasskey, fetchCredentials, deleteCredential, isLoading, error } = usePasskey();
    const [passkeyName, setPasskeyName] = useState("My Device");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [credentials, setCredentials] = useState<any[]>([]);

    const loadCredentials = async () => {
        const list = await fetchCredentials();
        setCredentials(list);
    };

    // Load on mount
    useState(() => {
        loadCredentials();
    });

    const handleRegister = async () => {
        setSuccessMessage(null);
        const success = await registerPasskey(passkeyName);
        if (success) {
            setSuccessMessage("パスキーを登録しました");
            setPasskeyName("My Device");
            loadCredentials(); // Refresh list
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("このパスキーを削除してもよろしいですか？")) return;
        const success = await deleteCredential(id);
        if (success) {
            loadCredentials();
        }
    };

    return (
        <div className="passkey-settings">
            <h1 className="text-xl font-bold mb-4">パスキー設定</h1>
            <p className="mb-4 text-sm text-gray-600">
                お使いのデバイス（指紋認証、顔認証など）を使って、パスワードなしでログインできるようにします。
            </p>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <FaFingerprint size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold">新しいパスキーを追加</h3>
                        <p className="text-xs text-gray-500">
                            現在使用しているこのデバイスを登録します
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={passkeyName}
                        onChange={(e) => setPasskeyName(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
                        placeholder="デバイス名（例: MacBook Pro）"
                    />
                    <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? "登録中..." : "登録"}
                    </button>
                </div>

                {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
                {successMessage && <p className="mt-2 text-green-600 text-sm">{successMessage}</p>}
            </div>

            <h3 className="font-bold mb-2 text-gray-700">登録済みのパスキー</h3>

            {credentials.length === 0 ? (
                <p className="text-sm text-gray-500">登録済みのパスキーはありません。</p>
            ) : (
                <div className="space-y-2">
                    {credentials.map((cred) => (
                        <div key={cred.credentialId} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                            <div>
                                <p className="font-medium text-sm">{cred.name}</p>
                                <p className="text-xs text-gray-500">登録日: {new Date(cred.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(cred.credentialId)}
                                className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                            >
                                削除
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
