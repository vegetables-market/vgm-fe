"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";

export default function ProfileEditPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  // 1. 既存のデータを読み込む
  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      setUserData(JSON.parse(savedData));
    } else {
      // 初期データ（今の page.tsx にあるモックと同じもの）
      setUserData({
        displayName: "田中 花子",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=hanako",
        bio: "趣味で野菜を育てています🌱"
      });
    }
  }, []);

  // 2. データを保存して戻る
  const handleSave = (updatedUser: any) => {
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    // 保存したことを知らせてから戻る
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