"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/client";

interface SessionInfo {
  sessionId: number;
  deviceInfo: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  expiresAt: string;
  isCurrent: boolean;
}

export default function DevicesPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

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

  const handleRevokeSession = async (sessionId: number) => {
    if (!confirm("このデバイスをログアウトさせますか？")) return;

    setError("");
    setIsLoading(true);

    try {
      await fetchApi<{ success: boolean }>(`/v1/user/sessions/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSuccess("デバイスをログアウトさせました");
      fetchSessions();
    } catch (err: any) {
      setError(err.message || "操作に失敗しました");
    } finally {
      setIsLoading(false);
    }
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

  const parseDeviceInfo = (deviceInfo: string | null) => {
    if (!deviceInfo) return { browser: "不明", os: "不明" };

    // 簡易的なUser-Agent解析
    let browser = "不明";
    let os = "不明";

    if (deviceInfo.includes("Chrome")) browser = "Chrome";
    else if (deviceInfo.includes("Firefox")) browser = "Firefox";
    else if (deviceInfo.includes("Safari")) browser = "Safari";
    else if (deviceInfo.includes("Edge")) browser = "Edge";

    if (deviceInfo.includes("Windows")) os = "Windows";
    else if (deviceInfo.includes("Mac")) os = "macOS";
    else if (deviceInfo.includes("Linux")) os = "Linux";
    else if (deviceInfo.includes("Android")) os = "Android";
    else if (deviceInfo.includes("iPhone") || deviceInfo.includes("iPad"))
      os = "iOS";

    return { browser, os };
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="devices-page">
      <h1 className="page-title">ログイン中のデバイス</h1>
      <p className="page-subtitle">
        現在あなたのアカウントにログインしているデバイス一覧です
      </p>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* デバイス一覧 */}
      <div className="session-list">
        {sessions.map((session) => {
          const device = parseDeviceInfo(session.deviceInfo);
          return (
            <div
              key={session.sessionId}
              className={`session-item ${session.isCurrent ? "current" : ""}`}
            >
              <div className="session-icon">
                {device.os === "Windows"
                  ? "💻"
                  : device.os === "macOS"
                    ? "🖥️"
                    : device.os === "iOS" || device.os === "Android"
                      ? "📱"
                      : "🌐"}
              </div>
              <div className="session-info">
                <div className="session-header">
                  <span className="session-device">
                    {device.browser} / {device.os}
                  </span>
                  {session.isCurrent && (
                    <span className="badge current">現在のデバイス</span>
                  )}
                </div>
                <div className="session-details">
                  {session.ipAddress && <span>IP: {session.ipAddress}</span>}
                  <span>ログイン: {formatDate(session.createdAt)}</span>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  className="btn-revoke"
                  onClick={() => handleRevokeSession(session.sessionId)}
                  disabled={isLoading}
                >
                  ログアウト
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 一括ログアウト */}
      {otherSessionsCount > 0 && (
        <div className="bulk-action">
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
          margin-bottom: 24px;
        }

        .session-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: #fff;
        }

        .session-item.current {
          background: #f0f9ff;
        }

        .session-icon {
          font-size: 28px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 12px;
        }

        .session-item.current .session-icon {
          background: #e3f2fd;
        }

        .session-info {
          flex: 1;
        }

        .session-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
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
        }

        .session-details {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #888;
        }

        .btn-revoke {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
          color: #d32f2f;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-revoke:hover:not(:disabled) {
          background: #ffebee;
          border-color: #ffcdd2;
        }

        .btn-revoke:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        @media (max-width: 768px) {
          .session-item {
            flex-wrap: wrap;
            gap: 12px;
          }

          .session-details {
            flex-direction: column;
            gap: 4px;
          }

          .btn-revoke {
            width: 100%;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
}
