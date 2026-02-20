"use client";

import Link from "next/link";
import { useTermsAgreement } from "@/hooks/auth/signup/useTermsAgreement";
import type { TermsAgreementProps } from "@/types/auth/signup-components";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import SignupStepHeader from "@/components/ui/auth/SignupStepHeader";
import AuthSubTitle from "@/components/ui/auth/AuthSubTitle";
import AuthAgreementItem from "@/components/ui/auth/AuthAgreementItem";

export default function TermsAgreement({
  onSubmit,
  loading,
}: TermsAgreementProps) {
  // const { agreed, setAgreed, subscribed, setSubscribed, handleSubmit } =
  //   useTermsAgreement({ onSubmit });
  const { agreed, setAgreed, handleSubmit } = useTermsAgreement({ onSubmit });

  return (
    <form onSubmit={handleSubmit}>
      <SignupStepHeader />
      <AuthSubTitle>利用規約の確認</AuthSubTitle>

      <section className="mb-4 flex flex-col gap-2">
        <AuthAgreementItem checked={agreed} onChange={() => setAgreed(!agreed)}>
          <span className="text-white">
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              GrandMarketの利用規約
            </Link>
            に同意します。
          </span>
        </AuthAgreementItem>

        {/*<AuthAgreementItem*/}
        {/*  checked={subscribed}*/}
        {/*  onChange={() => setSubscribed(!subscribed)}*/}
        {/*>*/}
        {/*  <span className="text-white">メールを希望します。</span>*/}
        {/*</AuthAgreementItem>*/}
      </section>
      {/* プライバシーポリシー */}
      <p className="mb-6 text-[12px]">
        個人情報をどのように収集、利用、保護しているかの詳細は、
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          GrandMarketのプライバシーポリシー
        </Link>
        をご覧ください。
      </p>

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
