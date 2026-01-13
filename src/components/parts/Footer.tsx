import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 上部: グリッドレイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-stone-800 pb-12">
          
          {/* ブランド情報 */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/vgm-fe/public" className="font-serif text-3xl font-bold text-white tracking-tight block mb-4">
              Harvest
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              旬を、手渡す。<br />
              生産者の顔が見える、<br />
              一番安心で美味しい食材マーケット。
            </p>
            {/* SNSアイコン（ダミー） */}
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'Facebook'].map((sns) => (
                <div key={sns} className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-green-700 hover:text-white transition cursor-pointer">
                  <span className="text-[10px] font-bold">{sns[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* リンク集 1: 市場 */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wider text-sm uppercase">Market</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-green-500 transition">野菜を探す</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">果物を探す</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">新着の生産者</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">特集記事</Link></li>
            </ul>
          </div>

          {/* リンク集 2: サポート */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wider text-sm uppercase">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-green-500 transition">ご利用ガイド</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">生産者登録について</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">よくある質問</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">お問い合わせ</Link></li>
            </ul>
          </div>

          {/* リンク集 3: 法的情報 */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wider text-sm uppercase">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-green-500 transition">利用規約</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">プライバシーポリシー</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">特定商取引法に基づく表記</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition">運営会社</Link></li>
            </ul>
          </div>
        </div>

        {/* 下部: コピーライト */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-stone-600">
          <p>&copy; 2025 Harvest Market. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Made with 🥬 in Japan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}