"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/api-client";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProceed = async () => {
    setIsLoading(true);
    setError("");

    try {
      // 削除用の認証コードを送信
      const data = await fetchApi<{ success: boolean; flow_id: string; message: string }>(
        "/v1/user/account/delete/request",
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (data.flow_id) {
        // チャレンジ画面へ遷移（削除用フローとして）
        router.push(`/challenge?flow_id=${data.flow_id}&action=delete_account`);
      } else {
        setError("処理に失敗しました");
      }
    } catch (err: any) {
      setError(err.message || "通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delete-account-page">
      <h1 className="page-title">アカウント削除</h1>
      
      <div className="warning-box">
        <span className="warning-icon">⚠️</span>
        <div>
          <h3>この操作は取り消せません</h3>
          <p>アカウントを削除すると、以下のデータがすべて失われます</p>
        </div>
      </div>

      <ul className="deletion-list">
        <li>プロフィール情報</li>
        <li>お気に入りリスト</li>
        <li>購入・販売履歴</li>
        <li>メッセージ履歴</li>
        <li>ポイント・クーポン</li>
      </ul>

      <div className="note-box">
        <p>
          ※ 取引中の商品がある場合、削除できません<br />
          ※ 売上金がある場合は事前に振込申請してください
        </p>
      </div>

      {error && (
        <div className="error-box">{error}</div>
      )}

      <div className="button-group">
        <button
          className="btn-cancel"
          onClick={() => router.push("/settings")}
          disabled={isLoading}
        >
          キャンセル
        </button>
        <button
          className="btn-proceed"
          onClick={handleProceed}
          disabled={isLoading}
        >
          {isLoading ? "処理中..." : "本人確認へ進む"}
        </button>
      </div>

      <style jsx>{`
        .delete-account-page {
          max-width: 500px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: #333;
          margin: 0 0 24px 0;
        }

        .warning-box {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: #fff5f5;
          border: 1px solid #ffcdd2;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .warning-icon {
          font-size: 28px;
        }

        .warning-box h3 {
          font-size: 16px;
          font-weight: 600;
          color: #d32f2f;
          margin: 0 0 4px 0;
        }

        .warning-box p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .deletion-list {
          background: #fafafa;
          border-radius: 10px;
          padding: 20px 20px 20px 40px;
          margin: 0 0 24px 0;
        }

        .deletion-list li {
          font-size: 14px;
          color: #555;
          margin-bottom: 8px;
        }

        .deletion-list li:last-child {
          margin-bottom: 0;
        }

        .note-box {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .note-box p {
          font-size: 13px;
          color: #888;
          margin: 0;
          line-height: 1.6;
        }

        .error-box {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 32px;
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

        .btn-proceed {
          flex: 1;
          padding: 14px;
          background: #d32f2f;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-proceed:hover:not(:disabled) {
          background: #b71c1c;
        }

        .btn-cancel:disabled,
        .btn-proceed:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
