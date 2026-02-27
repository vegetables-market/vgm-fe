"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { fetchApi } from "@/lib/api/fetch";
import { getApiUrl } from "@/lib/api/urls";

type AccountMeResponse = {
  displayName?: string;
  display_name?: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  hasPassword?: boolean;
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
            ? avatarRaw.startsWith("/api/")
              ? `${getApiUrl()}${avatarRaw}`
              : avatarRaw.startsWith("/")
                ? `${getApiUrl()}/api${avatarRaw}`
                : `${getApiUrl()}/api/${avatarRaw}`
            : null;

        setUserData({
          displayName: profile.displayName ?? profile.display_name ?? "",
          avatarUrl,
          bio: profile.bio ?? "",
          hasPassword: profile.hasPassword ?? false,
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
    setIsSaving(true);
    try {
      if (updatedUser.displayName !== userData.displayName) {
        await fetchApi("/v1/user/account/display-name", {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            displayName: updatedUser.displayName,
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
        const formData = new FormData();
        formData.append("image", updatedUser.avatarFile);
        const response = await fetch(`${getApiUrl()}/api/v1/user/profile/avatar`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Avatar upload failed");
        }
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
