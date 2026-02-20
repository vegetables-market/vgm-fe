import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          利用規約
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          最終更新日: 2026年2月19日
        </p>
      </header>

      <div className="space-y-8 text-sm leading-7 text-gray-800 md:text-base">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">第1条（適用）</h2>
          <p>
            本規約は、当社が提供するサービス（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意の上で本サービスを利用するものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第2条（アカウント）
          </h2>
          <p>
            ユーザーは、登録情報を正確かつ最新に保つものとし、アカウントの管理責任を負います。第三者による不正利用が疑われる場合、速やかに当社へ通知してください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第3条（禁止事項）
          </h2>
          <p>
            法令または公序良俗に反する行為、不正アクセス、他者へのなりすまし、虚偽情報の掲載、運営を妨害する行為を禁止します。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第4条（取引・支払い）
          </h2>
          <p>
            本サービス上の取引は、各商品ページおよび購入画面に表示される条件に従って成立します。支払い方法、手数料、キャンセル条件は別途表示に従います。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第5条（免責）
          </h2>
          <p>
            当社は、システム障害、通信環境、第三者サービス起因の損害について、当社に故意または重過失がある場合を除き責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            第6条（規約の変更）
          </h2>
          <p>
            当社は必要に応じて本規約を変更できます。変更後の規約は、本ページに掲示した時点で効力を生じます。
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
