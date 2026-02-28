"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";

export default function ProfileEditPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // localStorageからユーザーデータを読み込む
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUserData(JSON.parse(stored));
    } else {
      // userData がない場合は vgm_user からフォールバック
      const vgmUser = localStorage.getItem("vgm_user");
      if (vgmUser) {
        const parsed = JSON.parse(vgmUser);
        setUserData({
          displayName: parsed.displayName || "ゲスト",
          avatarUrl: parsed.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
          bio: "趣味で野菜を育てています🌱"
        });
      }
    }
  }, []);

  const handleSave = (updatedUser: any) => {
    // localStorageに保存（リロードしても維持される）
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    alert("プロフィールを更新しました！");
    router.push("/profile");
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