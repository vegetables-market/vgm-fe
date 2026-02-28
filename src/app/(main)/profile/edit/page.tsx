"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { fetchApi } from "@/lib/api/fetch";
import { getApiUrl } from "@/lib/api/urls";
import { uploadImage } from "@/lib/api/media";
import type { UploadTokenResponse } from "@/types/upload";

type AccountMeResponse = {
  displayName?: string;
  display_name?: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  hasPassword?: boolean;
  has_password?: boolean;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await fetchApi<AccountMeResponse>("/v1/user/account/me", {
          method: "GET",
          credentials: "include",
        });

        const avatarRaw = profile.avatarUrl ?? profile.avatar_url ?? null;
        const avatarUrl = avatarRaw && avatarRaw.startsWith("http")
          ? avatarRaw
          : avatarRaw
            ? toAvatarUrl(avatarRaw)
            : null;

        setUserData({
          displayName: profile.displayName ?? profile.display_name ?? "",
          avatarUrl,
          bio: profile.bio ?? "",
          hasPassword: profile.hasPassword ?? profile.has_password ?? false,
          password: "",
        });
      } catch (err) {
        console.error(err);
        alert("プロフィール情報の取得に失敗しました");
        setUserData({
          displayName: "",
          avatarUrl: null,
          bio: "",
          hasPassword: false,
          password: "",
        });
      }
    };

    load();
  }, []);

  const handleSave = async (updatedUser: any) => {
    if (!userData || isSaving) return;

    const isDisplayNameChanged = updatedUser.displayName !== userData.displayName;
    if (isDisplayNameChanged && userData.hasPassword && !(updatedUser.password ?? "").trim()) {
      alert("表示名を変更するにはパスワードの入力が必要です");
      return;
    }

    setIsSaving(true);
    try {
      if (isDisplayNameChanged) {
        await fetchApi("/v1/user/account/display-name", {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            display_name: updatedUser.displayName,
            password: updatedUser.password || undefined,
          }),
        });
      }

      if ((updatedUser.bio ?? "") !== (userData.bio ?? "")) {
        await fetchApi("/v1/user/profile/bio", {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            bio: updatedUser.bio ?? "",
          }),
        });
      }

      if (updatedUser.avatarFile instanceof File) {
        const { token, filename } = await fetchApi<UploadTokenResponse>("/v1/user/profile/avatar/upload-token", {
          method: "POST",
          credentials: "include",
        });
        await uploadImage(
          updatedUser.avatarFile,
          detectImageFormat(updatedUser.avatarFile),
          token,
          filename,
          { maxSizeBytes: 5 * 1024 * 1024 },
        );
        await fetchApi("/v1/user/profile/avatar", {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({ filename }),
        });
      }

      alert("プロフィールを更新しました");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert("プロフィール更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData) return <div className="p-8 text-center">読み込み中...</div>;

  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-center text-lg font-bold">プロフィール編集</h1>
      </div>
      <div className="mx-auto max-w-md">
        <ProfileEditForm initialUser={userData} onSave={handleSave} />
      </div>
    </main>
  );
}

function toAvatarUrl(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/")) {
    return `${getApiUrl()}/api${raw}`;
  }
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
  const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
  const cleaned = raw.startsWith("/") ? raw.slice(1) : raw;
  return `${baseUrl}/${cleaned}`;
}

function detectImageFormat(file: File): "jpg" | "png" | "webp" {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}
