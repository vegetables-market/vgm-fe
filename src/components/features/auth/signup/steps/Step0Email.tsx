"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaCircleExclamation } from "react-icons/fa6";
import SocialLoginButtons from "@/components/features/auth/SocialLoginButtons";
import { SignupFormData } from "@/types/auth";

interface Step0Props {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
  addLog: (msg: string) => void;
}

export default function Step0Email({
  formData,
  setFormData,
  onNext,
  addLog,
}: Step0Props) {
  const [showError, setShowError] = useState(false);

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  }, [formData.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setShowError(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold">メールアドレス</span>
          </div>

          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="mail@example.com"
            className={`mb-1 h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
              showError && !isEmailValid
                ? "border-red-400"
                : "border-white/70 focus:border-white"
            }`}
            autoFocus
          />
          {showError && !isEmailValid && (
            <div className="mb-2 flex items-center text-xs text-red-400">
              <FaCircleExclamation className="mr-1" />
              <p>有効なメールアドレスを入力してください。</p>
            </div>
          )}
        </section>

        <button
          type="submit"
          className="mt-6 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black transition-colors hover:bg-gray-200"
        >
          次へ
        </button>
      </form>

      <div className="w-full">
        <div className="relative my-6 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="bg-[#121212] px-2 text-gray-400">または</span>
          </div>
        </div>

        <SocialLoginButtons
          mode="signup"
          onProviderClick={(id) => addLog(`Social signup: ${id}`)}
        />

        <div className="mt-8 flex w-full items-center justify-center border-t border-gray-800 pt-6">
          <span className="mr-1 text-xs text-[#b3b3b3]">
            アカウントをお持ちの方は
          </span>
          <Link
            href="/login"
            className="text-xs text-white underline hover:text-gray-300"
          >
            ここからログイン
          </Link>
        </div>
      </div>
    </>
  );
}
