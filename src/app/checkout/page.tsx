"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // ★追加: フォームの入力値を管理するState
  const [address, setAddress] = useState({
    lastName: '',
    firstName: '',
    postalCode: '',
    prefecture: '',
    city: '',
    street: '',
    building: ''
  });

  // ★追加: 住所自動入力のエラーメッセージ
  const [zipError, setZipError] = useState('');

  // カートが空なら表示
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f8f4]">
        <div className="text-center">
            <p className="text-stone-500 mb-4">カートは空です...</p>
            <button onClick={() => router.push('/')} className="text-green-600 underline font-bold">トップに戻る</button>
        </div>
      </div>
    );
  }

  // ★追加: 郵便番号が変更された時の処理
  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/-/g, ''); // ハイフンを除去
    setAddress({ ...address, postalCode: val });
    setZipError('');

    // 7桁になったら住所検索APIを叩く
    if (val.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${val}`);
        const data = await res.json();

        if (data.results) {
          const result = data.results[0];
          setAddress(prev => ({
            ...prev,
            prefecture: result.address1,   // 都道府県
            city: result.address2 + result.address3, // 市区町村 + 町域
            street: '' // 番地はクリアして入力を促す
          }));
        } else {
          setZipError('住所が見つかりませんでした');
        }
      } catch (err) {
        setZipError('住所検索に失敗しました');
      }
    }
  };

  // 入力欄の共通ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // 決済処理のモック
    setTimeout(() => {
      alert("注文が完了しました！ありがとうございます。");
      clearCart();
      router.push('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f9f8f4] text-stone-700 flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:py-12">
        <h1 className="text-2xl font-serif font-bold text-stone-800 mb-8 text-center">お支払い手続き</h1>

        <form onSubmit={handlePayment} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          
          {/* 1. 配送先 */}
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              配送先住所
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" name="lastName" placeholder="姓" required 
                value={address.lastName} onChange={handleChange}
                className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" 
              />
              <input 
                type="text" name="firstName" placeholder="名" required 
                value={address.firstName} onChange={handleChange}
                className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" 
              />
              
              {/* 郵便番号入力 */}
              <div className="col-span-2 relative">
                <input 
                    type="text" name="postalCode" placeholder="郵便番号 (ハイフンなし7桁)" required 
                    value={address.postalCode} onChange={handleZipChange}
                    maxLength={7}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" 
                />
                {zipError && <p className="absolute -bottom-5 text-xs text-red-500 font-bold">{zipError}</p>}
                {/* ローディング表示などを入れても良い */}
              </div>

              {/* 住所自動入力エリア */}
              <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
                 <input 
                    type="text" name="prefecture" placeholder="都道府県" required 
                    value={address.prefecture} onChange={handleChange}
                    className="bg-stone-100 border border-stone-200 rounded-lg px-4 py-3 outline-none font-bold text-stone-600" 
                />
                 <input 
                    type="text" name="city" placeholder="市区町村" required 
                    value={address.city} onChange={handleChange}
                    className="bg-stone-100 border border-stone-200 rounded-lg px-4 py-3 outline-none font-bold text-stone-600" 
                />
              </div>

              <input 
                type="text" name="street" placeholder="番地 (例: 1-2-3)" required 
                value={address.street} onChange={handleChange}
                className="col-span-2 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" 
              />
              <input 
                type="text" name="building" placeholder="建物名・部屋番号 (任意)" 
                value={address.building} onChange={handleChange}
                className="col-span-2 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          {/* 2. 支払い方法 */}
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              お支払い情報
            </h2>
            <div className="space-y-3">
               <div className="border border-green-500 bg-green-50 rounded-lg p-4 flex items-center gap-3">
                 <input type="radio" name="payment" defaultChecked className="text-green-600 focus:ring-green-500" />
                 <span className="font-bold text-sm">クレジットカード</span>
               </div>
               
               {/* カード情報入力 (ダミー) */}
               <div className="pl-8 grid grid-cols-2 gap-4 mt-2 mb-4">
                 <input type="text" placeholder="カード番号" className="col-span-2 bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none" />
                 <input type="text" placeholder="有効期限 (MM/YY)" className="bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none" />
                 <input type="text" placeholder="CVC" className="bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none" />
               </div>
               <p className="text-xs text-stone-400 pl-2">※現在はテスト環境のため、実際の決済は行われません。</p>

               <div className="border border-stone-200 rounded-lg p-4 flex items-center gap-3 opacity-50">
                 <input type="radio" name="payment" disabled />
                 <span className="font-bold text-sm text-stone-400">コンビニ決済 (準備中)</span>
               </div>
            </div>
          </div>

          {/* 合計とボタン */}
          <div className="border-t border-stone-100 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">合計金額</span>
              <span className="font-serif text-3xl font-bold text-green-800">¥{totalPrice.toLocaleString()}</span>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-full hover:bg-green-700 transition shadow-lg disabled:bg-stone-300 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "注文を確定する"
              )}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}