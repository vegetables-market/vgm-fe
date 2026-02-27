import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          プライバシーポリシー
        </h1>
        <p className="mt-2 text-sm text-gray-500">最終更新日: 2026年2月27日</p>
      </header>

      <div className="space-y-8 text-sm leading-7 text-gray-800 md:text-base">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">第1条（基本方針）</h2>
          <p>
            当社は、ユーザーの個人情報を適切に保護し、関連法令およびガイドラインを遵守して取り扱います。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第2条（取得する情報）
          </h2>
          <p>
            当社は、アカウント登録情報、取引情報、利用履歴、端末情報など、サービス提供に必要な情報を取得する場合があります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">第3条（利用目的）</h2>
          <p>
            取得した情報は、本人確認、サービス提供、問い合わせ対応、品質改善、不正利用防止、お知らせ配信のために利用します。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第4条（第三者提供）
          </h2>
          <p>
            当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第5条（安全管理）
          </h2>
          <p>
            当社は、個人情報の漏えい、滅失、毀損の防止その他安全管理のため、合理的な技術的・組織的対策を実施します。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第6条（開示・訂正・削除）
          </h2>
          <p>
            ユーザーは、法令の定めに基づき、自己の個人情報の開示、訂正、利用停止、削除を請求できます。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第7条（ポリシーの変更）
          </h2>
          <p>
            当社は、必要に応じて本ポリシーを変更できます。変更後の内容は本ページに掲載した時点で効力を生じます。
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link href="/" className="text-sm text-green-700 underline hover:text-green-800">
          トップページへ戻る
        </Link>
      </div>
    </main>
  );
}
