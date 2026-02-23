"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaAndroid,
  FaApple,
  FaArrowLeft,
  FaClock,
  FaDesktop,
  FaGlobe,
  FaLinux,
  FaShieldHalved,
  FaWindows,
} from "react-icons/fa6";

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
        const data = await fetchApi<{ sessions: SessionResponse[] }>(
          "/v1/user/sessions",
          {
            credentials: "include",
          },
        );
        const target = data.sessions.find(
          (s) => s.sessionId.toString() === sessionId,
        );
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

  if (isLoading)
    return <div className="p-8 text-center text-gray-500">読み込み中...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!session)
    return (
      <div className="p-8 text-center text-gray-500">
        セッションが見つかりません
      </div>
    );

  const device = parseUserAgent(session.deviceInfo || "");

  return (
    <div className="mx-auto max-w-xl pb-12">
      <div className="mb-6">
        <Link
          href="/settings/security/devices"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-800"
        >
          <FaArrowLeft className="mr-1" /> デバイス一覧に戻る
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col items-center border-b border-gray-50 bg-gray-50/50 p-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
            {getOsIcon(device.os)}
          </div>
          <h1 className="mb-1 text-xl font-bold text-gray-800">
            {device.os} {device.browser}
          </h1>
          <p className="text-sm text-gray-500">
            {session.isCurrent
              ? "現在使用中のデバイス"
              : "ログイン中のデバイス"}
          </p>
        </div>

        <div className="space-y-6 p-6">
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
              <div className="value">
                {formatDate(session.lastActiveAt || session.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 p-6">
          {session.isCurrent ? (
            <div className="p-2 text-center text-sm text-gray-500">
              現在のデバイスはここからは削除できません。
              <br />
              ログアウト機能を使用してください。
            </div>
          ) : (
            <button
              onClick={handleRevoke}
              disabled={isRevoking}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
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
