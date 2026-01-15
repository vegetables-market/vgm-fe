"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/layouts/Footer';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-[#f9f8f4] text-stone-700 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:py-12">
        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8 flex items-center gap-3">
          ショッピングカート
          <span className="text-base font-sans font-normal text-stone-400">({cartItems.length}点)</span>
        </h1>

        {cartItems.length === 0 ? (
          // カートが空の場合
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-100">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">カートは空です</h2>
            <p className="text-stone-500 mb-8">新鮮な野菜や食材を探しに行きましょう！</p>
            <Link href="/vgm-fe/public" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition">
              買い物を続ける
            </Link>
          </div>
        ) : (
          // カートに商品がある場合
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左側: 商品リスト */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative w-24 h-24 shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                    {/* ここは img タグを使っているので next/image のインポートは不要 */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-stone-800">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">{item.producer}</p>
                    
                    <div className="flex justify-between items-end">
                      {/* カート内での個数変更セレクター */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-stone-200 rounded-full px-2 py-1 bg-stone-50">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-red-500 font-bold transition"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-stone-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-green-600 font-bold transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <p className="font-serif text-xl font-bold text-green-700">¥{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 右側: 合計・レジへ進む */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 sticky top-24">
                <h2 className="font-bold text-lg mb-4 border-b border-stone-100 pb-2">注文サマリー</h2>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-stone-500">小計</span>
                  <span className="font-bold">¥{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-stone-500">送料</span>
                  <span className="font-bold text-green-600">無料</span>
                </div>
                <div className="border-t border-stone-100 pt-4 mb-6 flex justify-between items-center">
                  <span className="font-bold text-lg">合計</span>
                  <span className="font-serif text-2xl font-bold text-green-800">¥{totalPrice.toLocaleString()}</span>
                </div>
                <Link href="/checkout" className="block w-full bg-stone-800 text-white text-center font-bold py-4 rounded-full hover:bg-black transition shadow-lg transform active:scale-95">
                  レジへ進む
                </Link>
                <p className="text-xs text-center text-stone-400 mt-4">
                  安心・安全な決済システムを利用しています
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}