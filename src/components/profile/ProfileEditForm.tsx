import React, { useState, useRef } from "react";
import Image from "next/image";

interface ProfileEditFormProps {
  initialUser: any;
  onSave: (updatedUser: any) => void;
}

export function ProfileEditForm({ initialUser, onSave }: ProfileEditFormProps) {
  const [user, setUser] = useState(initialUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* アイコン編集部分 */}
      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-emerald-500 shadow-sm transition hover:opacity-80"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image src={user.avatarUrl || "/images/default-avatar.png"} alt="Avatar" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
            <span className="text-xs font-bold">変更</span>
          </div>
        </div>
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
        <p className="text-xs text-gray-500">タップして画像を変更</p>
      </div>

      {/* テキスト入力部分 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">名前</label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none"
            value={user.displayName}
            onChange={(e) => setUser({ ...user, displayName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">自己紹介</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none"
            value={user.bio}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={() => onSave(user)}
        className="w-full rounded-lg bg-emerald-500 py-3 font-bold text-white transition hover:bg-emerald-600"
      >
        変更を保存する
      </button>
    </div>
  );
}