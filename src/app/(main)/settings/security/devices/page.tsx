"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/fetch";
import { parseUserAgent } from "@/lib/utils/user-agent";
import { 
  FaWindows, 
  FaApple, 
  FaAndroid, 
  FaLinux, 
  FaDesktop,
  FaChevronRight
} from "react-icons/fa6";
import Link from "next/link";

interface SessionInfo {
  sessionId: number;
  deviceInfo: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  expiresAt: string;
  isCurrent: boolean;
  provider?: string;
}

export default function DevicesPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  // ハッシュリンクの自動スクロール処理
  useEffect(() => {
    if (!isLoading && sessions.length > 0) {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [isLoading, sessions]);

  const fetchSessions = async () => {
    try {
      const data = await fetchApi<{ sessions: SessionInfo[] }>(
        "/v1/user/sessions",
        {
          credentials: "include",
        },
      );
      setSessions(data.sessions);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRevokeAllOther = async () => {
    if (
      !confirm("現在のデバイス以外のすべてのデバイスをログアウトさせますか？")
    )
      return;

    setError("");
    setIsLoading(true);

    try {
      const result = await fetchApi<{ success: boolean; revokedCount: number }>(
        "/v1/user/sessions",
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      setSuccess(`${result.revokedCount}件のデバイスをログアウトさせました`);
      fetchSessions();
    } catch (err: any) {
      setError(err.message || "操作に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const getOsIcon = (os: string) => {
    switch (os) {
      case "Windows": return <FaWindows className="text-xl" />;
      case "macOS": return <FaApple className="text-xl" />;
      case "iOS": return <FaApple className="text-xl" />;
      case "Android": return <FaAndroid className="text-xl" />;
      case "Linux": return <FaLinux className="text-xl" />;
      default: return <FaDesktop className="text-xl" />;
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  // OSごとにセッションをグルーピング
  const groupedSessions = sessions.reduce((groups, session) => {
    const { os } = parseUserAgent(session.deviceInfo);
    if (!groups[os]) groups[os] = [];
    groups[os].push(session);
    return groups;
  }, {} as Record<string, SessionInfo[]>);

  // OSの表示順序を定義 (必要であれば)
  const sortedOsKeys = Object.keys(groupedSessions).sort();

  return (
    <div className="devices-page">
      <h1 className="page-title">ログイン中のデバイス</h1>
      <p className="page-subtitle">
        現在あなたのアカウントにログインしているデバイス一覧です
      </p>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* デバイス一覧 (OSごとにグループ化) */}
      <div className="space-y-8">
        {sortedOsKeys.map((os) => (
          <div key={os} id={`os-${os}`} className="scroll-mt-24">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800 border-b pb-2">
              <span className="text-gray-500">{getOsIcon(os)}</span>
              {os} デバイス
            </h2>
            
            <div className="session-list">
              {groupedSessions[os].map((session) => {
                const device = parseUserAgent(session.deviceInfo);
                return (
                  <Link
                    key={session.sessionId}
                    href={`/settings/security/devices/detail?sessionId=${session.sessionId}`}
                    className={`session-item ${session.isCurrent ? "current" : ""} block hover:bg-gray-50 transition-colors cursor-pointer group`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="session-icon">
                        {getOsIcon(device.os)}
                      </div>
                      <div className="session-info flex-1">
                        <div className="session-header">
                          <span className="session-device">
                            {device.browser} {device.deviceType !== "desktop" ? `(${device.deviceType})` : ""}
                          </span>
                          {session.isCurrent && (
                            <span className="badge current">現在のデバイス</span>
                          )}
                        </div>
                        <div className="session-details">
                          {session.ipAddress && <span>IP: {session.ipAddress}</span>}
                          <span>ログイン: {formatDate(session.createdAt)}</span>
                          {!session.isCurrent && session.lastActiveAt && (
                             <span>最終アクセス: {formatDate(session.lastActiveAt)}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
              ログイン中のデバイスはありません
          </div>
      )}

      {/* 一括ログアウト */}
      {otherSessionsCount > 0 && (
        <div className="bulk-action mt-8">
          <button
            className="btn-revoke-all"
            onClick={handleRevokeAllOther}
            disabled={isLoading}
          >
            他のすべてのデバイスをログアウト ({otherSessionsCount}件)
          </button>
          <p className="bulk-note">
            不審なログインがある場合に使用してください
          </p>
        </div>
      )}

      <style jsx>{`
        .devices-page {
          max-width: 600px;
          padding-bottom: 40px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0 0 24px 0;
        }

        .error-box {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .success-box {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .session-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #eee;
          border-radius: 12px;
          overflow: hidden;
        }

        .session-item {
          display: block;
          padding: 18px 20px;
          background: #fff;
          text-decoration: none;
        }

        .session-item.current {
          background: #f0f9ff;
        }

        .session-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 12px;
          color: #555;
          flex-shrink: 0;
        }

        .session-item.current .session-icon {
          background: #e3f2fd;
          color: #0288d1;
        }

        .session-info {
          min-width: 0; 
        }

        .session-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .session-device {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .badge.current {
          font-size: 11px;
          padding: 2px 8px;
          background: #1976d2;
          color: #fff;
          border-radius: 4px;
          white-space: nowrap;
        }

        .session-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
          color: #666;
        }

        .bulk-action {
          text-align: center;
          padding: 20px;
          background: #fafafa;
          border-radius: 12px;
        }

        .btn-revoke-all {
          padding: 14px 28px;
          background: #d32f2f;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-revoke-all:hover:not(:disabled) {
          background: #b71c1c;
        }

        .btn-revoke-all:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bulk-note {
          font-size: 12px;
          color: #888;
          margin: 12px 0 0 0;
        }

        @media (max-width: 600px) {
          .session-item {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
