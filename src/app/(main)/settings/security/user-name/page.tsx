"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";
import { useAuth } from "@/context/AuthContext";

interface ProfileInfo {
  userId: number;
  username: string;
  hasPassword: boolean;
  displayName: string;
}

export default function UserNameChangePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const data = await fetchApi<ProfileInfo>("/v1/user/account/me", {
        credentials: "include",
      });
      setProfileInfo(data);
      setNewUsername(data.username);
    } catch (err) {
      console.error("Failed to fetch profile info", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // バリデーション
    if (newUsername.length < 3) {
      setError("ユーザー名は3文字以上で入力してください");
      return;
    }

    if (newUsername.length > 20) {
      setError("ユーザー名は20文字以下で入力してください");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setError("ユーザー名は英数字とアンダースコアのみ使用できます");
      return;
    }

    setIsLoading(true);

    try {
      const result = await fetchApi<{
        success: boolean;
        message: string;
        username: string;
      }>("/v1/user/account/username", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          newUsername,
          password: profileInfo?.hasPassword ? password : null,
        }),
      });

      setSuccess("ユーザー名を変更しました");
      setPassword("");

      // AuthContextのユーザー情報を更新
      if (user) {
        updateUser({ ...user, username: result.username });
      }

      // プロフィール情報を更新
      fetchProfileInfo();
    } catch (err: any) {
      setError(err.message || "ユーザー名の変更に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="username-page">
      <h1 className="page-title">ユーザー名変更</h1>
      <p className="page-subtitle">
        ログインに使用するユーザー名を変更できます
      </p>

      <form onSubmit={handleSubmit} className="username-form">
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <div className="form-group">
          <label className="form-label">現在のユーザー名</label>
          <div className="current-value">{profileInfo?.username || "-"}</div>
        </div>

        <div className="form-group">
          <label className="form-label">新しいユーザー名</label>
          <input
            type="text"
            className="form-input"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="3〜20文字の英数字"
            required
            minLength={3}
            maxLength={20}
          />
          <p className="input-hint">
            英数字とアンダースコア(_)のみ使用できます
          </p>
        </div>

        {profileInfo?.hasPassword && (
          <div className="form-group">
            <label className="form-label">パスワード（本人確認）</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              required
            />
          </div>
        )}

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
            disabled={isLoading || newUsername === profileInfo?.username}
          >
            {isLoading ? "処理中..." : "変更する"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .username-page {
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

        .username-form {
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

        .current-value {
          padding: 12px 16px;
          background: #f5f5f5;
          border-radius: 8px;
          font-size: 15px;
          color: #555;
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

        .input-hint {
          font-size: 12px;
          color: #888;
          margin: 0;
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
