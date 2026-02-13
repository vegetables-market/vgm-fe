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
        <p className="mb-1 text-base text-[#b3b3b3]">繧ｹ繝・ャ繝・4 / 4</p>
        <p className="text-base font-bold text-white">蛻ｩ逕ｨ隕冗ｴ・・遒ｺ隱・/p>
      </div>

      <section className="space-y-4 text-white">
        <div className="h-40 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-xs">
          <p className="mb-2 font-bold">蛻ｩ逕ｨ隕冗ｴ・/p>
          <p>縺薙％縺ｫ蛻ｩ逕ｨ隕冗ｴ・・隕∫ｴ・ユ繧ｭ繧ｹ繝医′蜈･繧翫∪縺吶ゅせ繧ｯ繝ｭ繝ｼ繝ｫ蜿ｯ閭ｽ縺ｧ縺吶・/p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
            ultricies sed, dolor. Cras elementum ultrices diam.
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
            {agreed && <span className="font-bold text-black">笨・/span>}
          </div>
          <span className="text-sm text-white group-hover:text-gray-300">
            <Link href="/terms" target="_blank" className="underline">
              蛻ｩ逕ｨ隕冗ｴ・            </Link>{" "}
            縺ｨ{" "}
            <Link href="/privacy" target="_blank" className="underline">
              繝励Λ繧､繝舌す繝ｼ繝昴Μ繧ｷ繝ｼ
            </Link>{" "}
            縺ｫ蜷梧э縺励∪縺吶・          </span>
        </label>
      </section>

      <AuthSubmitButton
        isLoading={loading}
        loadingText="逋ｻ骭ｲ荳ｭ..."
        disabled={!agreed || loading}
      >
        蜷梧э縺励※逋ｻ骭ｲ縺吶ｋ
      </AuthSubmitButton>
    </form>
  );
}
