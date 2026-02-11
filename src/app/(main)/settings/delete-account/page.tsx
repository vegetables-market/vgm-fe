"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";
import { FaCircleExclamation } from "react-icons/fa6";
import AuthButton from "@/components/features3/auth/ui/AuthButton";
import { useAuth } from "@/context/AuthContext";

export default function DeleteAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const hasRequested = useRef(false);
  const { logout } = useAuth();

  const actionToken = searchParams.get("action_token");

  // Initial check & redirection
  useEffect(() => {
    if (actionToken) return;
    if (hasRequested.current) return;
    hasRequested.current = true;

    const requestDeletion = async () => {
      try {
        const data = await fetchApi<{
          success: boolean;
          flow_id: string;
          auth_type: string;
          message: string;
        }>("/v1/user/account/delete/request", {
          method: "POST",
          credentials: "include",
        });

        const currentPath = window.location.pathname; // /settings/delete-account
        const redirectTo = encodeURIComponent(currentPath);

        if (data.auth_type === "TOTP") {
          // flow_id is actually mfa_token for TOTP
          router.push(
            `/challenge?type=totp&token=${data.flow_id}&action=delete_account&redirect_to=${redirectTo}`,
          );
        } else {
          const maskedEmailParam = (data as any).masked_email
            ? `&masked_email=${encodeURIComponent((data as any).masked_email)}`
            : "";
          router.push(
            `/challenge?type=email&flow_id=${data.flow_id}&action=delete_account&redirect_to=${redirectTo}${maskedEmailParam}`,
          );
        }
      } catch (err: any) {
        setError(err.message || "通信エラーが発生しました");
      }
    };

    requestDeletion();
  }, [actionToken, router]);

  // Handle Token Invalidation on Unmount / Navigate away
  useEffect(() => {
    if (!actionToken) return;

    // Best-effort invalidation (Beacon or simple fetch)
    // Since sendBeacon is POST, verificationCode consumption logic might need separate "invalidation" endpoint
    // or we just trust the short expiry (5min).
    // Given the requirement "best-effort", let's rely on short expiry for now to avoid complexity of addl endpoint.
    // If strict invalidation is needed, we'd need /v1/user/account/delete/cancel endpoint.

    const handleBeforeUnload = () => {
      // Optional: Invalidate token
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [actionToken]);

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionToken) return;
    if (!agreed) {
      setError("アカウント削除に同意する必要があります。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchApi<{ success: boolean; message: string }>(
        "/v1/user/account/delete/confirm",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ action_token: actionToken }),
        },
      );

      if (data.success) {
        await logout();
        router.push("/?deleted=true");
      } else {
        setError("削除に失敗しました");
      }
    } catch (err: any) {
      setError(err.message || "通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center text-white">
        <p className="mb-4 text-red-500">{error}</p>
        <button
          onClick={() => router.push("/settings")}
          className="text-sm text-zinc-400 underline hover:text-white"
        >
          設定に戻る
        </button>
      </div>
    );
  }

  if (!actionToken) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-white"></div>
          <p className="text-zinc-400">セキュリティ確認へ移動中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          アカウント削除の確認
        </h2>

        <div className="mb-8 text-center">
          <p className="mb-2 text-sm text-gray-400">本人確認が完了しました。</p>
          <p className="text-sm font-bold text-red-500">
            ※ この操作は取り消せません。すべてのデータが完全に削除されます。
          </p>
        </div>

        <form onSubmit={handleConfirmDelete}>
          <div className="mb-8 flex items-start justify-center gap-3 px-2">
            <input
              type="checkbox"
              id="agree-delete"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-500"
            />
            <label
              htmlFor="agree-delete"
              className="cursor-pointer text-sm leading-relaxed text-zinc-300 select-none"
            >
              アカウント削除に同意します。
              <br />
              データは復元できないことを理解しました。
            </label>
          </div>

          {error && (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              <FaCircleExclamation />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <AuthButton
              type="submit"
              isLoading={isLoading}
              disabled={!agreed}
              className="w-full !border-none !bg-red-600 py-3 text-white transition-colors hover:!bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              アカウントを削除する
            </AuthButton>

            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="w-full text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              キャンセルして戻る
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
