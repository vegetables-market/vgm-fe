"use client";

import { useState } from "react";
import Link from "next/link";

interface Step4Props {
  onSubmit: () => void;
  loading: boolean;
}

export default function Step4Terms({ onSubmit, loading }: Step4Props) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 4 / 4</p>
        <p className="text-base font-bold text-white">利用規約の確認</p>
      </div>

      <section className="space-y-4 text-white">
        <div className="h-40 overflow-y-auto p-3 bg-zinc-800 rounded-lg text-xs border border-zinc-700">
          <p className="font-bold mb-2">利用規約</p>
          <p>ここに利用規約のテキストが入ります。スクロール可能です。</p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
            Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
            ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
            massa, varius a, semper congue, euismod non, mi.
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="peer sr-only"
          />
          <div className="w-5 h-5 rounded-md border-2 border-white/70 flex items-center justify-center peer-checked:bg-amber-300 peer-checked:border-amber-300 transition-all">
            {agreed && <span className="text-black font-bold">✓</span>}
          </div>
          <span className="text-sm text-white group-hover:text-gray-300">
            <Link href="/terms" target="_blank" className="underline">利用規約</Link> と <Link href="/privacy" target="_blank" className="underline">プライバシーポリシー</Link> に同意します。
          </span>
        </label>
      </section>

      <button
        type="submit"
        disabled={!agreed || loading}
        className="mt-6 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "登録中..." : "同意して登録する"}
      </button>
    </form>
  );
}
