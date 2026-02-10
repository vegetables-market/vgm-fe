"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/client";

interface EmailInfo {
  emailId: number;
  email: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
}

export default function EmailManagementPage() {
  const [emails, setEmails] = useState<EmailInfo[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const data = await fetchApi<{ emails: EmailInfo[] }>("/v1/user/emails", {
        credentials: "include",
      });
      setEmails(data.emails);
    } catch (err) {
      console.error("Failed to fetch emails", err);
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const data = await fetchApi<{ success: boolean; flow_id: string }>(
        "/v1/user/emails",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ email: newEmail }),
        },
      );

      setFlowId(data.flow_id);
      setSuccess("認証コードを送信しました");
    } catch (err: any) {
      setError(err.message || "メールアドレスの追加に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId) return;

    setError("");
    setIsLoading(true);

    try {
      await fetchApi<{ success: boolean }>("/v1/user/emails/verify", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ flowId, code: verificationCode }),
      });

      setSuccess("メールアドレスを追加しました");
      setFlowId(null);
      setNewEmail("");
      setVerificationCode("");
      fetchEmails();
    } catch (err: any) {
      setError(err.message || "認証に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (emailId: number) => {
    setError("");
    try {
      await fetchApi<{ success: boolean }>(
        `/v1/user/emails/${emailId}/primary`,
        {
          method: "PUT",
          credentials: "include",
        },
      );
      setSuccess("プライマリメールアドレスを変更しました");
      fetchEmails();
    } catch (err: any) {
      setError(err.message || "変更に失敗しました");
    }
  };

  const handleDeleteEmail = async (emailId: number) => {
    if (!confirm("このメールアドレスを削除しますか？")) return;

    setError("");
    try {
      await fetchApi<{ success: boolean }>(`/v1/user/emails/${emailId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSuccess("メールアドレスを削除しました");
      fetchEmails();
    } catch (err: any) {
      setError(err.message || "削除に失敗しました");
    }
  };

  return (
    <div className="email-page">
      <h1 className="page-title">メールアドレス管理</h1>
      <p className="page-subtitle">登録済みのメールアドレスを管理できます</p>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* 登録済みメール一覧 */}
      <div className="email-list">
        {emails.map((email) => (
          <div key={email.emailId} className="email-item">
            <div className="email-info">
              <span className="email-address">{email.email}</span>
              {email.isPrimary && (
                <span className="badge primary">プライマリ</span>
              )}
              {email.isVerified && (
                <span className="badge verified">認証済み</span>
              )}
            </div>
            <div className="email-actions">
              {!email.isPrimary && email.isVerified && (
                <button
                  className="btn-small"
                  onClick={() => handleSetPrimary(email.emailId)}
                >
                  プライマリに設定
                </button>
              )}
              {!email.isPrimary && (
                <button
                  className="btn-small danger"
                  onClick={() => handleDeleteEmail(email.emailId)}
                >
                  削除
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* メールアドレス追加フォーム */}
      <div className="add-section">
        <h2 className="section-title">メールアドレスを追加</h2>

        {!flowId ? (
          <form onSubmit={handleAddEmail} className="add-form">
            <input
              type="email"
              className="form-input"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
            <button type="submit" className="btn-add" disabled={isLoading}>
              {isLoading ? "送信中..." : "追加"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmail} className="verify-form">
            <p className="verify-note">{newEmail} に認証コードを送信しました</p>
            <input
              type="text"
              className="form-input"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                )
              }
              placeholder="認証コード（6桁）"
              maxLength={6}
              required
            />
            <div className="verify-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setFlowId(null);
                  setVerificationCode("");
                }}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn-verify"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "確認中..." : "確認"}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .email-page {
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

        .email-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #eee;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 32px;
        }

        .email-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #fff;
        }

        .email-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .email-address {
          font-size: 14px;
          color: #333;
        }

        .badge {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .badge.primary {
          background: #e3f2fd;
          color: #1976d2;
        }

        .badge.verified {
          background: #e8f5e9;
          color: #388e3c;
        }

        .email-actions {
          display: flex;
          gap: 8px;
        }

        .btn-small {
          font-size: 12px;
          padding: 6px 12px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          color: #555;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-small:hover {
          background: #eee;
        }

        .btn-small.danger {
          color: #d32f2f;
        }

        .btn-small.danger:hover {
          background: #ffebee;
        }

        .add-section {
          background: #f9f9f9;
          border-radius: 10px;
          padding: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
        }

        .add-form {
          display: flex;
          gap: 12px;
        }

        .form-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: #333;
        }

        .btn-add {
          padding: 12px 24px;
          background: #333;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-add:hover:not(:disabled) {
          background: #555;
        }

        .btn-add:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .verify-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .verify-note {
          font-size: 13px;
          color: #666;
          margin: 0;
        }

        .verify-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
        }

        .btn-verify {
          flex: 1;
          padding: 12px;
          background: #333;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
        }

        .btn-verify:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
