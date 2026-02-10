"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";

interface ProfileInfo {
  userId: number;
  username: string;
  hasPassword: boolean;
  displayName: string;
}

export default function PasswordChangePage() {
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const data = await fetchApi<ProfileInfo>("/v1/user/account/me", {
        credentials: "include"
      });
      setProfileInfo(data);
    } catch (err) {
      console.error("Failed to fetch profile info", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // バリデーション
    if (newPassword.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      await fetchApi<{ success: boolean; message: string }>(
        "/v1/user/profile/password",
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            currentPassword: profileInfo?.hasPassword ? currentPassword : null,
            newPassword
          })
        }
      );

      setSuccess("パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // プロフィール情報を更新
      fetchProfileInfo();
    } catch (err: any) {
      setError(err.message || "パスワードの変更に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-page">
      <h1 className="page-title">パスワード変更</h1>
      <p className="page-subtitle">
        {profileInfo?.hasPassword 
          ? "新しいパスワードを設定できます" 
          : "パスワードを設定すると、メールアドレスとパスワードでもログインできるようになります"}
      </p>

      <form onSubmit={handleSubmit} className="password-form">
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        {profileInfo?.hasPassword && (
          <div className="form-group">
            <label className="form-label">現在のパスワード</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="現在のパスワード"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">新しいパスワード</label>
          <input
            type="password"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8文字以上"
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label className="form-label">新しいパスワード（確認）</label>
          <input
            type="password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="もう一度入力"
            required
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => router.push("/settings/security")}
            disabled={isLoading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : "変更する"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .password-page {
          max-width: 450px;
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

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-box {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .success-box {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .form-input {
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #333;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .btn-cancel {
          flex: 1;
          padding: 14px;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #eee;
        }

        .btn-submit {
          flex: 1;
          padding: 14px;
          background: #333;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background: #555;
        }

        .btn-cancel:disabled,
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
