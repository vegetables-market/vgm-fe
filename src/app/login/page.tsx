"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ★ Googleログイン（のフリ）をする関数
  const handleGoogleLogin = () => {
    setIsLoading(true);

    // 1.5秒後にログイン成功扱いにする
    setTimeout(() => {
      // "ログイン済み" という証拠を保存する
      sessionStorage.setItem('harvest_is_logged_in', 'true');
      alert("Googleアカウントでログインしました！");
      router.push('/'); // トップページへ戻る
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f9f8f4] flex items-center justify-center p-4 font-sans text-stone-700">

      {/* メインコンテナ */}
      <div className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-[900px] min-h-[600px] transition-all duration-300 ${isRightPanelActive ? "right-panel-active" : ""}`}>

        {/* ================================= 1. 新規登録 (Sign Up) ================================= */}
        <div className={`absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out left-0 opacity-0 z-10 ${isRightPanelActive ? "translate-x-[100%] opacity-100 z-50" : ""}`}>
          <form className="bg-white flex flex-col items-center justify-center h-full px-10 text-center">
            <h1 className="font-serif text-3xl font-bold mb-4 text-green-800">Create Account</h1>

            {/* SNSアイコン */}
            <div className="flex space-x-3 mb-6">
              {/* ★ Googleボタン (SVGアイコンに変更) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition group"
              >
                {isLoading ? (
                  // ロード中のくるくる
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                ) : (
                  // GoogleのロゴSVG
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
              </button>
              {/* 他のボタンはダミーのまま */}
              <button type="button" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-gray-500 font-bold">F</button>
              <button type="button" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-gray-500 font-bold">L</button>
            </div>

            <span className="text-xs text-gray-400 mb-4">またはメールアドレスで登録</span>
            <input type="text" placeholder="お名前" className="bg-gray-100 border-none px-4 py-3 mb-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-300" />
            <input type="email" placeholder="メールアドレス" className="bg-gray-100 border-none px-4 py-3 mb-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-300" />
            <input type="password" placeholder="パスワード" className="bg-gray-100 border-none px-4 py-3 mb-6 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-300" />
            <button className="bg-green-600 text-white font-bold py-3 px-10 rounded-full uppercase tracking-widest text-xs hover:bg-green-700 transition-transform active:scale-95 shadow-lg">登録する</button>
          </form>
        </div>

        {/* ================================= 2. ログイン (Sign In) ================================= */}
        <div className={`absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out left-0 z-20 ${isRightPanelActive ? "translate-x-[100%]" : ""}`}>
          <form className="bg-white flex flex-col items-center justify-center h-full px-10 text-center">
            <h1 className="font-serif text-3xl font-bold mb-4 text-green-800">Sign in</h1>

            <div className="flex space-x-3 mb-6">
              {/* ★ Googleボタン (ここにも追加) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition group"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
              </button>
              <button type="button" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-gray-500 font-bold">F</button>
              <button type="button" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-gray-500 font-bold">L</button>
            </div>

            <span className="text-xs text-gray-400 mb-4">登録済みのアカウントを使用</span>
            <input type="email" placeholder="メールアドレス" className="bg-gray-100 border-none px-4 py-3 mb-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-300" />
            <input type="password" placeholder="パスワード" className="bg-gray-100 border-none px-4 py-3 mb-4 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-300" />
            <a href="#" className="text-xs text-gray-500 hover:text-green-600 mb-6 border-b border-transparent hover:border-green-600 transition-colors">パスワードをお忘れですか？</a>

            <button
              type="button"
              onClick={handleGoogleLogin} // 通常ログインボタンもモック動作にしちゃう
              className="bg-green-600 text-white font-bold py-3 px-10 rounded-full uppercase tracking-widest text-xs hover:bg-green-700 transition-transform active:scale-95 shadow-lg"
            >
              ログイン
            </button>

            <Link href="/" className="mt-8 text-xs text-gray-400 hover:text-green-600 underline">← トップページに戻る</Link>
          </form>
        </div>

        {/* ================================= 3. オーバーレイ (変更なし) ================================= */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
            alt="Background"
            fill
            className="object-cover"
            priority // 重要なメイン画像なので優先読み込み
            sizes="50vw"
          />
          {/* 緑色のフィルター */}
          <div className="absolute inset-0 bg-green-900/60 mix-blend-multiply"></div>
        </div>
        <div className={`absolute top-0 flex flex-col items-center justify-center h-full w-1/2 px-10 text-center transform transition-transform duration-700 ease-in-out ${isRightPanelActive ? "translate-x-0" : "-translate-x-[20%]"}`}>
          <h1 className="font-serif text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-sm font-light mb-8 leading-relaxed">すでにアカウントをお持ちの方は<br />こちらからログインしてください。</p>
          <button className="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full uppercase tracking-widest text-xs hover:bg-white hover:text-green-800 transition-colors active:scale-95" onClick={() => setIsRightPanelActive(false)}>ログイン画面へ</button>
        </div>
        <div className={`absolute top-0 right-0 flex flex-col items-center justify-center h-full w-1/2 px-10 text-center transform transition-transform duration-700 ease-in-out ${isRightPanelActive ? "translate-x-[20%]" : "translate-x-0"}`}>
          <h1 className="font-serif text-3xl font-bold mb-4">Harvest App</h1>
          <p className="text-sm font-light mb-8 leading-relaxed">旬の食材を、産地から食卓へ。<br />新しい食の体験を始めましょう。</p>
          <button className="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full uppercase tracking-widest text-xs hover:bg-white hover:text-green-800 transition-colors active:scale-95" onClick={() => setIsRightPanelActive(true)}>新規登録へ</button>
        </div>
      </div>
    </div>

  );
}
