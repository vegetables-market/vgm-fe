import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 py-16 font-sans text-stone-400">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* 上部: グリッドレイアウト */}
        <div className="mb-16 grid grid-cols-1 gap-12 border-b border-stone-800 pb-12 md:grid-cols-4">
          {/* ブランド情報 */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/vgm-fe/public"
              className="mb-4 block font-serif text-3xl font-bold tracking-tight text-white"
            >
              Harvest
            </Link>
            <p className="mb-6 text-sm leading-relaxed">
              旬を、手渡す。
              <br />
              生産者の顔が見える、
              <br />
              一番安心で美味しい食材マーケット。
            </p>
            {/* SNSアイコン（ダミー） */}
            <div className="flex gap-4">
              {["Twitter", "Instagram", "Facebook"].map((sns) => (
                <div
                  key={sns}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-stone-800 transition hover:bg-green-700 hover:text-white"
                >
                  <span className="text-[10px] font-bold">{sns[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* リンク集 1: 市場 */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Market
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  野菜を探す
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  果物を探す
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  新着の生産者
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  特集記事
                </Link>
              </li>
            </ul>
          </div>

          {/* リンク集 2: サポート */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  ご利用ガイド
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  生産者登録について
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* リンク集 3: 法的情報 */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-green-500">
                  運営会社
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 下部: コピーライト */}
        <div className="flex flex-col items-center justify-between text-xs text-stone-600 md:flex-row">
          <p>&copy; 2025 Harvest Market. All rights reserved.</p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <span>Made with 🥬 in Japan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
