"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/fetch";

interface OAuthConnection {
  connectionId: number;
  provider: string;
  providerEmail: string | null;
  connectedAt: string;
}

interface ProviderInfo {
  id: string;
  name: string;
  icon: string;
}

export default function OAuthPage() {
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [availableProviders, setAvailableProviders] = useState<ProviderInfo[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const data = await fetchApi<{
        connections: OAuthConnection[];
        availableProviders: ProviderInfo[];
      }>("/v1/user/oauth/connections", {
        credentials: "include",
      });
      setConnections(data.connections);
      setAvailableProviders(data.availableProviders);
    } catch (err) {
      console.error("Failed to fetch connections", err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDisconnect = async (provider: string, providerName: string) => {
    if (!confirm(`${providerName}との連携を解除しますか？`)) return;

    setError("");
    setIsLoading(true);

    try {
      await fetchApi<{ success: boolean }>(
        `/v1/user/oauth/connections/${provider}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      setSuccess(`${providerName}との連携を解除しました`);
      fetchConnections();
    } catch (err: any) {
      setError(err.message || "操作に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (provider: string) => {
    // OAuth連携開始（既存のログインフローを使用）
    window.location.href = `/login?connect=${provider}`;
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M 5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        );
      case "microsoft":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#F25022" d="M1 1h10v10H1z" />
            <path fill="#00A4EF" d="M1 13h10v10H1z" />
            <path fill="#7FBA00" d="M13 1h10v10H13z" />
            <path fill="#FFB900" d="M13 13h10v10H13z" />
          </svg>
        );
      case "github":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        );
      case "apple":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        );
      default:
        return <span>🔗</span>;
    }
  };

  const isConnected = (providerId: string) => {
    return connections.some(
      (c) => c.provider.toLowerCase() === providerId.toLowerCase(),
    );
  };

  const getConnection = (providerId: string) => {
    return connections.find(
      (c) => c.provider.toLowerCase() === providerId.toLowerCase(),
    );
  };

  return (
    <div className="oauth-page">
      <h1 className="page-title">外部サービス連携</h1>
      <p className="page-subtitle">外部アカウントを使用してログインできます</p>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <div className="provider-list">
        {availableProviders.map((provider) => {
          const connected = isConnected(provider.id);
          const connection = getConnection(provider.id);

          return (
            <div
              key={provider.id}
              className={`provider-item ${connected ? "connected" : ""}`}
            >
              <div className="provider-icon">
                {getProviderIcon(provider.id)}
              </div>
              <div className="provider-info">
                <div className="provider-name">{provider.name}</div>
                {connected && connection?.providerEmail && (
                  <div className="provider-email">
                    {connection.providerEmail}
                  </div>
                )}
                {connected && connection && (
                  <div className="provider-date">
                    連携日: {formatDate(connection.connectedAt)}
                  </div>
                )}
              </div>
              <div className="provider-action">
                {connected ? (
                  <button
                    className="btn-disconnect"
                    onClick={() => handleDisconnect(provider.id, provider.name)}
                    disabled={isLoading}
                  >
                    連携解除
                  </button>
                ) : (
                  <button
                    className="btn-connect"
                    onClick={() => handleConnect(provider.id)}
                    disabled={isLoading}
                  >
                    連携する
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="info-box">
        <h3>外部サービス連携について</h3>
        <ul>
          <li>
            外部アカウントを連携すると、そのアカウントでログインできるようになります
          </li>
          <li>連携を解除しても、外部サービス側のデータには影響しません</li>
          <li>パスワードを設定していない場合、最後の連携は解除できません</li>
        </ul>
      </div>

      <style jsx>{`
        .oauth-page {
          max-width: 550px;
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

        .provider-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #eee;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .provider-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #fff;
        }

        .provider-item.connected {
          background: #f0f9ff;
        }

        .provider-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 12px;
        }

        .provider-item.connected .provider-icon {
          background: #e3f2fd;
        }

        .provider-info {
          flex: 1;
        }

        .provider-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 2px;
        }

        .provider-email {
          font-size: 13px;
          color: #666;
        }

        .provider-date {
          font-size: 12px;
          color: #999;
        }

        .btn-connect {
          padding: 10px 20px;
          background: #333;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-connect:hover:not(:disabled) {
          background: #555;
        }

        .btn-connect:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-disconnect {
          padding: 10px 20px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #d32f2f;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-disconnect:hover:not(:disabled) {
          background: #ffebee;
          border-color: #ffcdd2;
        }

        .btn-disconnect:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .info-box {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 20px;
        }

        .info-box h3 {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 0 0 12px 0;
        }

        .info-box ul {
          margin: 0;
          padding-left: 20px;
        }

        .info-box li {
          font-size: 13px;
          color: #666;
          margin-bottom: 6px;
        }

        .info-box li:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
