"use client";

import { useMemo, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { SignupFormData } from "@/types/auth";

interface Step1Props {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
}

export default function Step1Username({ formData, setFormData, onNext }: Step1Props) {
  const [showError, setShowError] = useState(false);

  const isUsernameValid = useMemo(() => {
    // 3文字以上、英数字とアンダースコアのみ
    return formData.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(formData.username);
  }, [formData.username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameValid) {
      setShowError(true);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 1 / 4</p>
        <p className="text-base font-bold text-white">ユーザーIDを設定</p>
      </div>

      <section>
        <div className="mb-2 w-full">
          <span className="text-[13px] font-bold text-white">ユーザーID (ログイン用)</span>
        </div>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
          placeholder="user_name_123"
          className={`mb-1 h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
            showError && !isUsernameValid
              ? "!border-red-400"
              : "!border-white/70 focus:!border-white"
          }`}
          autoFocus
        />
        <p className="text-[11px] text-gray-400 mt-1">
          3文字以上の英数字とアンダースコアが使用できます。
        </p>
        {showError && !isUsernameValid && (
          <div className="mt-2 flex items-center text-xs text-red-400">
            <FaCircleExclamation className="mr-1" />
            <p>有効なユーザーIDを入力してください。</p>
          </div>
        )}
      </section>

      <button
        type="submit"
        className="mt-6 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black hover:bg-gray-200 transition-colors"
      >
        次へ
      </button>
    </form>
  );
}
