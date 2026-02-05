"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/api-client";

interface UserProfile {
  username: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  gender: number;
  birthDate: string | null;
  isEmailVerified: boolean;
}

export default function ProfileEditPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<number>(0);
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await fetchApi<UserProfile>("/v1/user/profile", {
        credentials: "include",
      });
      setProfile(data);
      setDisplayName(data.displayName);
      setBio(data.bio || "");
      setGender(data.gender);
      setBirthDate(data.birthDate || "");
      setAvatarPreview(data.avatarUrl);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("ファイルサイズは5MB以下にしてください");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateDisplayName = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await fetchApi("/v1/user/profile/display-name", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          displayName,
          password: password || undefined,
        }),
      });
      setSuccess("表示名を更新しました");
      setPassword("");
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await fetchApi("/v1/user/profile/bio", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ bio }),
      });
      setSuccess("自己紹介を更新しました");
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await fetchApi("/v1/user/profile/info", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          gender,
          birthDate: birthDate || undefined,
        }),
      });
      setSuccess("ユーザー情報を更新しました");
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", avatarFile);

      const response = await fetch("/v1/user/profile/avatar", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "アップロードに失敗しました");
      }

      setSuccess("プロフィール画像を更新しました");
      setAvatarFile(null);
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "アップロードに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="profile-edit-page">
      <h1 className="page-title">プロフィール編集</h1>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* プロフィール画像 */}
      <section className="section">
        <h2 className="section-title">プロフィール画像</h2>
        <div className="avatar-section">
          <div className="avatar-preview">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                {/*{profile.displayName.charAt(0).toUpperCase()}*/}
              </div>
            )}
          </div>
          <div className="avatar-controls">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              id="avatar-input"
              className="file-input"
            />
            <label htmlFor="avatar-input" className="btn-secondary">
              画像を選択
            </label>
            {avatarFile && (
              <button
                onClick={handleUploadAvatar}
                disabled={isLoading}
                className="btn-primary"
              >
                アップロード
              </button>
            )}
          </div>
          <p className="help-text">JPEG、PNG、WebP形式、最大5MB</p>
        </div>
      </section>

      {/* 表示名 */}
      <section className="section">
        <h2 className="section-title">表示名</h2>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input"
          maxLength={100}
        />
        {profile.email && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="確認用パスワード"
            className="input"
          />
        )}
        <button
          onClick={handleUpdateDisplayName}
          // disabled={isLoading || !displayName.trim()}
          className="btn-primary"
        >
          表示名を更新
        </button>
      </section>

      {/* 自己紹介 */}
      <section className="section">
        <h2 className="section-title">自己紹介</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="textarea"
          maxLength={1000}
          rows={5}
          placeholder="自己紹介を入力してください"
        />
        <p className="char-count">{bio.length}/1000</p>
        <button
          onClick={handleUpdateBio}
          disabled={isLoading}
          className="btn-primary"
        >
          自己紹介を更新
        </button>
      </section>

      {/* ユーザー情報 */}
      <section className="section">
        <h2 className="section-title">ユーザー情報</h2>
        <div className="form-group">
          <label>性別</label>
          <select
            value={gender}
            onChange={(e) => setGender(Number(e.target.value))}
            className="select"
          >
            <option value={0}>未選択</option>
            <option value={1}>男性</option>
            <option value={2}>女性</option>
            <option value={3}>その他</option>
          </select>
        </div>
        <div className="form-group">
          <label>生年月日</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="input"
          />
        </div>
        <button
          onClick={handleUpdateUserInfo}
          disabled={isLoading}
          className="btn-primary"
        >
          ユーザー情報を更新
        </button>
      </section>

      <style jsx>{`
        .profile-edit-page {
          max-width: 600px;
          padding: 24px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
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

        .section {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .avatar-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          font-size: 48px;
          font-weight: 700;
          color: #999;
        }

        .avatar-controls {
          display: flex;
          gap: 12px;
        }

        .file-input {
          display: none;
        }

        .input,
        .textarea,
        .select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .textarea {
          resize: vertical;
          font-family: inherit;
        }

        .char-count {
          text-align: right;
          font-size: 12px;
          color: #999;
          margin: -8px 0 12px 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .btn-primary {
          padding: 12px 24px;
          background: #333;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background: #555;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f5f5f5;
        }

        .help-text {
          font-size: 12px;
          color: #999;
          margin: 0;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #999;
        }
      `}</style>
    </div>
  );
}
