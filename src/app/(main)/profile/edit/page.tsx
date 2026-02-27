"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api/fetch";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        displayName: user.displayName || "ゲスト",
        avatarUrl: user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
        bio: "趣味で野菜を育てています🌱"
      });
    }
  }, [user]);

  const handleSave = async (updatedUser: any, avatarFile: File | null) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      let finalAvatarUrl = updatedUser.avatarUrl;

      // 1. 画像が新しく選ばれた場合はアップロードAPIを呼ぶ
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        const res = await fetchApi<{ avatarUrl: string }>("/v1/user/profile/avatar", {
          method: "POST",
          body: formData,
        });
        finalAvatarUrl = res.avatarUrl;
      }

      // 2. 表示名が変更された場合は更新APIを呼ぶ
      if (updatedUser.displayName !== user.displayName) {
        await fetchApi("/v1/user/account/display-name", {
          method: "PUT",
          body: JSON.stringify({ displayName: updatedUser.displayName }),
        });
      }

      // 3. 自己紹介を更新するAPIを呼ぶ
      await fetchApi("/v1/user/profile/bio", {
        method: "PUT",
        body: JSON.stringify({ bio: updatedUser.bio }),
      });

      // AuthContext と LocalStorage の情報を更新
      updateUser({ 
        ...user, 
        ...updatedUser,
        displayName: updatedUser.displayName, 
        avatarUrl: finalAvatarUrl 
      });

      alert("プロフィールを更新しました！");
      router.push("/profile");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("プロフィールの更新に失敗しました。");
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
        <ProfileEditForm initialUser={userData} isSaving={isSaving} onSave={handleSave} />
      </div>
    </main>
  );
}