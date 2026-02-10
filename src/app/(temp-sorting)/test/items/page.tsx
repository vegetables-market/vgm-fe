"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/layouts/Footer';
import { useCart } from '@/context/CartContext';
// TODO: Create data module or replace with real API
import { ITEMS_DATA } from '@/lib/data';

// ==========================================
//  詳細コンテンツコンポーネント
// ==========================================
function DetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { addToCart } = useCart();
  
  // ★個数選択用のState
  const [quantity, setQuantity] = useState(1);

  // データ取得
  const item = ITEMS_DATA.find(i => i.id === Number(id));

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-600">
        <p className="text-xl mb-4">商品が見つかりませんでした。</p>
        <Link href="/vgm-fe/public" className="text-green-600 hover:underline">トップページに戻る</Link>
      </div>
    );
  }

  // カートに入れる処理
  const handleAddToCart = () => {
    // 選択された個数分だけループして追加する（またはContext側を改修して個数を渡せるようにするのもアリ）
    // 今回は簡易的にループで対応します
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.imageUrl,
        producer: item.producer,
      });
    }
    // 完了したら個数を1に戻す？（お好みで）
    setQuantity(1);
  };

  // 個数の増減ハンドラ
  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden animate-fade-in-up mt-8">
      <div className="grid md:grid-cols-2">
        
        {/* 左側：商品画像 */}
        <div className="h-80 md:h-[500px] bg-gray-100 relative group">
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority 
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-600 shadow-sm z-10">
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
            {item.description || "新鮮な食材をお届けします。"}
          </p>

          <div className="mt-auto">
            {/* 価格表示 */}
            <div className="flex items-end justify-between mb-6">
                <span className="text-sm text-stone-400">価格 (税込)</span>
                <span className="text-4xl font-bold text-green-600">¥{item.price.toLocaleString()}</span>
            </div>

            {/* ★追加: 個数選択とカートボタンのエリア */}
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* 個数選択カウンター */}
              <div className="flex items-center justify-between bg-stone-100 rounded-full px-4 py-2 w-full sm:w-40 border border-stone-200">
                <button onClick={decrement} className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-green-600 text-xl font-bold transition">-</button>
                <span className="text-lg font-bold text-stone-800">{quantity}</span>
                <button onClick={increment} className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-green-600 text-xl font-bold transition">+</button>
              </div>

              {/* カートに入れるボタン */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-stone-800 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-200 transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                {/* ショッピングカートアイコン */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                カートに入れる
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
//  メインページコンポーネント
// ==========================================
export default function DetailPage() {
  return (
    <div className="min-h-screen bg-[#f9f8f4] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 md:px-8">
        <nav className="max-w-5xl mx-auto mb-4 flex items-center text-stone-500 text-sm">
          <Link href="/vgm-fe/public" className="hover:text-green-600 transition-colors flex items-center gap-1 font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            トップページに戻る
          </Link>
        </nav>

        <Suspense fallback={<div className="text-center py-20 text-stone-400 animate-pulse">Loading details...</div>}>
          <DetailContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}