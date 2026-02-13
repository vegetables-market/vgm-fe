"use client";

import Link from "next/link";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import { useTermsAgreement } from "@/hooks/auth/signup/useTermsAgreement";
import type { TermsAgreementProps } from "@/types/auth/signup-components";

export default function TermsAgreement({
  onSubmit,
  loading,
}: TermsAgreementProps) {
  const { agreed, setAgreed, handleSubmit } = useTermsAgreement({ onSubmit });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 4 / 4</p>
        <p className="text-base font-bold text-white">利用規約の確認</p>
      </div>

      <section className="space-y-4 text-white">
        <div className="h-40 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-xs">
          <p className="mb-2 font-bold">利用規約</p>
          <p>ここに利用規約の要約テキストが入ります。スクロール可能です。</p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, dolor. Cras elementum ultrices diam.
          </p>
        </div>

        <label className="group flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="peer sr-only"
          />
          <div className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-white/70 transition-all peer-checked:border-amber-300 peer-checked:bg-amber-300">
            {agreed && <span className="font-bold text-black">✓</span>}
          </div>
          <span className="text-sm text-white group-hover:text-gray-300">
            <Link href="/terms" target="_blank" className="underline">
              利用規約
            </Link>{" "}
            と{" "}
            <Link href="/privacy" target="_blank" className="underline">
              プライバシーポリシー
            </Link>{" "}
            に同意します。
          </span>
        </label>
      </section>

      <AuthSubmitButton
        isLoading={loading}
        loadingText="登録中..."
        disabled={!agreed || loading}
      >
        同意して登録する
      </AuthSubmitButton>
    </form>
  );
}
