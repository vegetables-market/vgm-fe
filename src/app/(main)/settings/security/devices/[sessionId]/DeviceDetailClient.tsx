"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaAndroid, FaApple, FaArrowLeft, FaClock, FaDesktop, FaGlobe, FaLinux, FaShieldHalved, FaWindows } from "react-icons/fa6";

import { fetchApi } from "@/lib/api/fetch";
import { parseUserAgent } from "@/lib/utils/user-agent";
import { SessionResponse } from "@/types/session";

type Props = {
  sessionId: string;
};

export default function DeviceDetailClient({ sessionId }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError("");
    setSession(null);

    const run = async () => {
      try {
        const data = await fetchApi<{ sessions: SessionResponse[] }>("/v1/user/sessions", {
          credentials: "include",
        });
        const target = data.sessions.find((s) => s.sessionId.toString() === sessionId);
        if (target) {
          setSession(target);
        } else {
          setError("セッションが見つかりません");
        }
      } catch (err) {
        console.error("Failed to fetch session", err);
        setError("情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [sessionId]);

  const handleRevoke = async () => {
    if (!session) return;
    if (!confirm("本当にこのデバイスをログアウトさせますか？")) return;

    setIsRevoking(true);
    try {
      await fetchApi(`/v1/user/sessions/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      router.push("/settings/security/devices");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "ログアウトに失敗しました");
      setIsRevoking(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOsIcon = (os: string) => {
    switch (os) {
      case "Windows":
        return <FaWindows className="text-4xl text-blue-600" />;
      case "macOS":
        return <FaApple className="text-4xl text-gray-800" />;
      case "iOS":
        return <FaApple className="text-4xl text-gray-800" />;
      case "Android":
        return <FaAndroid className="text-4xl text-green-600" />;
      case "Linux":
        return <FaLinux className="text-4xl text-yellow-600" />;
      default:
        return <FaDesktop className="text-4xl text-gray-500" />;
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">読み込み中...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!session) return <div className="p-8 text-center text-gray-500">セッションが見つかりません</div>;

  const device = parseUserAgent(session.deviceInfo || "");

  return (
    <div className="max-w-xl mx-auto pb-12">
      <div className="mb-6">
        <Link
          href="/settings/security/devices"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft className="mr-1" /> デバイス一覧に戻る
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center border-b border-gray-50 bg-gray-50/50">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
            {getOsIcon(device.os)}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {device.os} {device.browser}
          </h1>
          <p className="text-sm text-gray-500">{session.isCurrent ? "現在使用中のデバイス" : "ログイン中のデバイス"}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="detail-row">
            <div className="icon-wrapper">
              <FaGlobe />
            </div>
            <div className="detail-content">
              <label>IPアドレス</label>
              <div className="value">{session.ipAddress || "不明"}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="icon-wrapper">
              <FaClock />
            </div>
            <div className="detail-content">
              <label>最初のログイン</label>
              <div className="value">{formatDate(session.createdAt)}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="icon-wrapper">
              <FaShieldHalved />
            </div>
            <div className="detail-content">
              <label>最終アクセス</label>
              <div className="value">{formatDate(session.lastActiveAt || session.createdAt)}</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          {session.isCurrent ? (
            <div className="text-center text-sm text-gray-500 p-2">
              現在のデバイスはここからは削除できません。<br />
              ログアウト機能を使用してください。
            </div>
          ) : (
            <button
              onClick={handleRevoke}
              disabled={isRevoking}
              className="w-full py-3 px-4 bg-white border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRevoking ? "処理中..." : "ログアウト (セッションを削除)"}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f5f7fa;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .detail-content {
          flex: 1;
        }
        .detail-content label {
          display: block;
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 2px;
          font-weight: 500;
        }
        .detail-content .value {
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

