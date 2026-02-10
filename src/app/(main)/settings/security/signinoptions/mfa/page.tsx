"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";
import { fetchApi } from "@/lib/api/fetch";

type MfaStatus = {
  isEnabled: boolean;
  createdAt: string | null;
};

type MfaSetup = {
  secret: string;
  qrCodeUrl: string;
};

export default function MfaPage() {
  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null);
  const [setupData, setSetupData] = useState<MfaSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [step, setStep] = useState<"status" | "qr" | "verify" | "backup">("status");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MFA状態を取得
  const fetchMfaStatus = async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching MFA status...");
    try {
      const data = await fetchApi<MfaStatus>("/v1/user/mfa/status");
      console.log("MFA status fetched:", data);
      setMfaStatus(data);
    } catch (err) {
      console.error("Error fetching MFA status:", err);
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // MFA有効化を開始
  const startMfaSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<MfaSetup>("/v1/user/mfa/enable/start", {
        method: "POST",
      });
      setSetupData(data);
      setStep("qr");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 検証コードを送信してMFAを有効化
  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("6桁のコードを入力してください");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<{ backupCodes: string[] }>("/v1/user/mfa/enable/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      setBackupCodes(data.backupCodes);
      setStep("backup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "検証に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // MFAを無効化
  const disableMfa = async () => {
    const code = prompt("6桁の認証コードを入力してください");
    const password = prompt("パスワードを入力してください");

    if (!code || !password) return;

    setLoading(true);
    setError(null);
    try {
      await fetchApi("/v1/user/mfa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password }),
      });
      await fetchMfaStatus();
      setStep("status");
    } catch (err) {
      setError(err instanceof Error ? err.message : "無効化に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // バックアップコードをダウンロード
  const downloadBackupCodes = () => {
    const text = backupCodes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vgm-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 初回読み込み
  useEffect(() => {
    fetchMfaStatus();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">多要素認証（MFA）</h1>

          {loading && (
            <div className="flex justify-center my-4">
              <p className="text-gray-600">読み込み中...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === "status" && mfaStatus && (
            <div>
              <div className="mb-6">
                <p className="text-lg">
                  現在の状態: <strong>{mfaStatus.isEnabled ? "有効" : "無効"}</strong>
                </p>
                {mfaStatus.createdAt && (
                  <p className="text-sm text-gray-600 mt-2">
                    設定日時: {new Date(mfaStatus.createdAt).toLocaleString("ja-JP")}
                  </p>
                )}
              </div>

              {!mfaStatus.isEnabled ? (
                <button
                  onClick={startMfaSetup}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded disabled:opacity-50"
                >
                  {loading ? "読み込み中..." : "MFAを有効化"}
                </button>
              ) : (
                <button
                  onClick={disableMfa}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded disabled:opacity-50"
                >
                  {loading ? "処理中..." : "MFAを無効化"}
                </button>
              )}
            </div>
          )}

          {step === "qr" && setupData && (
            <div>
              <h2 className="text-xl font-bold mb-4">ステップ1: QRコードをスキャン</h2>
              <p className="mb-4">Google Authenticatorなどの認証アプリでQRコードをスキャンしてください。</p>

              <div className="flex justify-center mb-6">
                <QRCodeSVG value={setupData.qrCodeUrl} size={256} />
              </div>

              <div className="bg-gray-100 p-4 rounded mb-6">
                <p className="text-sm text-gray-600 mb-2">手動入力用シークレットキー:</p>
                <code className="text-sm font-mono">{setupData.secret}</code>
              </div>

              <button
                onClick={() => setStep("verify")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded"
              >
                次へ
              </button>
            </div>
          )}

          {step === "verify" && (
            <div>
              <h2 className="text-xl font-bold mb-4">ステップ2: 認証コードを入力</h2>
              <p className="mb-4">認証アプリに表示されている6桁のコードを入力してください。</p>

              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="border-2 border-gray-300 rounded px-4 py-2 text-center text-2xl tracking-widest mb-6 w-full"
                maxLength={6}
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("qr")}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 px-6 rounded"
                >
                  戻る
                </button>
                <button
                  onClick={verifyAndEnable}
                  disabled={loading || verificationCode.length !== 6}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded flex-1 disabled:opacity-50"
                >
                  {loading ? "検証中..." : "確認"}
                </button>
              </div>
            </div>
          )}

          {step === "backup" && backupCodes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">ステップ3: バックアップコードを保存</h2>
              <p className="mb-4 text-red-600 font-bold">
                これらのコードを安全な場所に保存してください。認証アプリにアクセスできない場合に使用できます。
              </p>

              <div className="bg-gray-100 p-4 rounded mb-6">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <code key={index} className="text-sm font-mono">
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={downloadBackupCodes}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded"
                >
                  ダウンロード
                </button>
                <button
                  onClick={() => {
                    fetchMfaStatus();
                    setStep("status");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded flex-1"
                >
                  完了
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
