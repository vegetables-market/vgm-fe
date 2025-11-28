"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// ==========================================
//  ダミーデータ (トップページと同じIDにする)
// ==========================================
const ITEMS_DATA = [
  { 
    id: 1, 
    name: "朝採れ完熟トマト", 
    price: 350, 
    producer: "山田農園", 
    category: "Vegetables",
    description: "太陽の光をたっぷり浴びて育った、真っ赤な完熟トマトです。酸味と甘みのバランスが絶妙で、サラダはもちろん、加熱してソースにするのもおすすめです。朝一番に収穫して、その日のうちに発送します。", 
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800" 
  },
  { 
    id: 2, 
    name: "無農薬ほうれん草", 
    price: 180, 
    producer: "佐藤ばあちゃん", 
    category: "Vegetables",
    description: "農薬を使わずに大切に育てたほうれん草です。えぐみが少なく、葉が肉厚で甘みがあるのが特徴です。お浸しやバターソテーで素材の味を楽しんでください。", 
    imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800" 
  },
  { 
    id: 3, 
    name: "泥付き人参", 
    price: 200, 
    producer: "田中ファーム", 
    category: "Vegetables",
    description: "土作りからこだわった、香り高い人参です。泥付きのままお届けすることで鮮度を保っています。皮まで美味しく食べられるので、きんぴらやスティックサラダにどうぞ。", 
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800" 
  },
  { 
    id: 4, 
    name: "新鮮なキャベツ", 
    price: 150, 
    producer: "鈴木さん", 
    category: "Vegetables",
    description: "高原の冷涼な気候で育った、シャキシャキのキャベツです。巻きがしっかりしていてずっしりと重みがあります。甘みが強いので千切りキャベツにするだけでご馳走になります。", 
    imageUrl: "https://images.unsplash.com/photo-1601648764658-cf3a4ab15393?auto=format&fit=crop&w=800" 
  },
  { 
    id: 5, 
    name: "秋鮭の切り身", 
    price: 400, 
    producer: "漁師の店", 
    category: "Seafood",
    description: "旬の秋鮭を船上で活け締めし、急速冷凍しました。脂が乗っていて身がふっくらとしています。焼き魚、ムニエル、ホイル焼きなど、どんな料理にも合います。", 
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800" 
  },
];

// ==========================================
//  詳細コンテンツコンポーネント
// ==========================================
function DetailContent() {
  // URLの ?id=XX を取得する
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // IDに一致する商品を検索
  // (URLのidは文字列なのでNumberに変換して比較)
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

  // 商品が見つかった場合
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden animate-fade-in-up">
      <div className="grid md:grid-cols-2">
        
        {/* 左側：商品画像 */}
        <div className="h-80 md:h-[500px] bg-gray-100 relative group">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-600 shadow-sm">
            {item.category}
          </div>
        </div>

        {/* 右側：商品情報 */}
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
            {item.description}
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
      {/* ヘッダー的なナビゲーション */}
      <nav className="max-w-5xl mx-auto mb-8 flex items-center text-stone-500 text-sm">
        <Link href="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Market
        </Link>
      </nav>

      {/* コンテンツ本体 (useSearchParamsを使うためSuspenseで囲む) */}
      <Suspense fallback={<div className="text-center py-20 text-stone-400">Loading details...</div>}>
        <DetailContent />
      </Suspense>

      {/* フッター */}
      <footer className="mt-16 text-center text-stone-400 text-xs">
        <p>© 2024 Harvest App. All rights reserved.</p>
      </footer>
    </div>
  );
}