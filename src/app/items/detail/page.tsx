"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // 追加
import { Suspense } from 'react';
import { ITEMS_DATA } from '@/lib/data'; // さっき作った共通データから読み込む

// ==========================================
//  詳細コンテンツコンポーネント
// ==========================================
function DetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // データ取得 (共通ファイルから検索)
  const item = ITEMS_DATA.find(i => i.id === Number(id));

  // 商品が見つからない場合
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-600">
        <p className="text-xl mb-4">商品が見つかりませんでした。</p>
        <Link href="/" className="text-green-600 hover:underline">
          トップページに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden animate-fade-in-up">
      <div className="grid md:grid-cols-2">
        
        {/* 左側：商品画像 (Next/Imageに変更) */}
        <div className="h-80 md:h-[500px] bg-gray-100 relative group">
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority // 詳細ページのメイン画像なので優先読み込み
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-600 shadow-sm z-10">
            {item.category}
          </div>
        </div>

        {/* 右側：商品情報 (変更なし) */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-sm text-green-600 font-bold mb-2 tracking-widest uppercase">Producer</p>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">👨‍🌾</div>
                <p className="text-stone-500 font-medium">{item.producer}</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-6 leading-tight">
            {item.name}
          </h1>

          <p className="text-stone-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
            {item.description || "新鮮な食材をお届けします。"}
          </p>

          <div className="mt-auto">
            <div className="flex items-end justify-between mb-6">
                <span className="text-sm text-stone-400">Price (Tax inc.)</span>
                <span className="text-4xl font-bold text-green-600">¥{item.price}</span>
            </div>

            <button 
              onClick={() => alert('カート機能はまだだよ！')}
              className="w-full bg-stone-800 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-200 transform hover:-translate-y-1"
            >
              カートに入れる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
//  メインページコンポーネント (枠組み)
// ==========================================
export default function DetailPage() {
  return (
    <div className="min-h-screen bg-[#f9f8f4] py-12 px-4 md:px-8">
      {/* ナビゲーション */}
      <nav className="max-w-5xl mx-auto mb-8 flex items-center text-stone-500 text-sm">
        <Link href="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Market
        </Link>
      </nav>

      {/* コンテンツ本体 (Suspense必須) */}
      <Suspense fallback={<div className="text-center py-20 text-stone-400 animate-pulse">Loading details...</div>}>
        <DetailContent />
      </Suspense>

      {/* フッター */}
      <footer className="mt-16 text-center text-stone-400 text-xs">
        <p>© 2024 Harvest App. All rights reserved.</p>
      </footer>
    </div>
  );
}