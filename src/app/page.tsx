"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from '@studio-freight/lenis';

// GSAPプラグイン登録 (クライアントサイドのみ実行)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("customEase", "M0,0 C0.86,0 0.07,1 1,1");
}

// ==========================================
//  ダミーデータ (通信エラー防止用)
// ==========================================
const DUMMY_ITEMS = [
  { id: 1, name: "朝採れ完熟トマト", price: 350, producer: "山田農園", category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400" },
  { id: 2, name: "無農薬ほうれん草", price: 180, producer: "佐藤ばあちゃん", category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400" },
  { id: 3, name: "泥付き人参", price: 200, producer: "田中ファーム", category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400" },
  { id: 4, name: "秋鮭の切り身", price: 400, producer: "漁師の店", category: "Seafood", imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400" },
  { id: 5, name: "原木しいたけ", price: 300, producer: "キノコ王", category: "Mushrooms", imageUrl: "https://images.unsplash.com/photo-1504472477451-05f31bc38d55?auto=format&fit=crop&w=400" },
  { id: 6, name: "新鮮なキャベツ", price: 150, producer: "鈴木さん", category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1601648764658-cf3a4ab15393?auto=format&fit=crop&w=400" },
  { id: 7, name: "採れたてナス", price: 220, producer: "野菜クラブ", category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400" },
  { id: 8, name: "こだわり卵(6個)", price: 400, producer: "平飼い養鶏場", category: "Eggs", imageUrl: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400" },
];

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const isAutoScrollingRef = useRef<boolean>(false);

  // State管理
  const [modalItems, setModalItems] = useState<typeof DUMMY_ITEMS>([]);
  const [modalTitle, setModalTitle] = useState("CATEGORY");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態

  // ==========================================
  //  初期化処理 (useEffect)
  // ==========================================
  useEffect(() => {
    // 1. Lenis (スムーズスクロール) 初期化
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. ログイン状態の確認
    if (sessionStorage.getItem('harvest_is_logged_in')) {
      setIsLoggedIn(true);
    }

    // 3. ローディング画面の制御
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      const isVisited = sessionStorage.getItem('harvest_visited');
      const entries = performance.getEntriesByType("navigation");
      const isReload = entries.length > 0 && (entries[0] as PerformanceNavigationTiming).type === 'reload';

      if (!isReload && isVisited) {
        // 2回目以降は即表示
        overlay.style.display = 'none';
        initScrollAnimation();
        startAutoScrollLoop();
      } else {
        // 初回ロード演出
        sessionStorage.setItem('harvest_visited', 'true');
        setTimeout(() => {
          gsap.to(overlay, {
            y: "-100%", duration: 1, ease: "power3.inOut",
            onComplete: () => {
              overlay.style.display = 'none';
              initScrollAnimation();
              startAutoScrollLoop();
            }
          });
        }, 1500);
      }
    }

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ==========================================
  //  自動スクロール機能 (不死鳥モード)
  // ==========================================
  const startAutoScrollLoop = () => {
    const updateInteraction = () => { lastInteractionTimeRef.current = Date.now(); };
    window.addEventListener('wheel', updateInteraction);
    window.addEventListener('touchmove', updateInteraction);
    window.addEventListener('click', updateInteraction);
    window.addEventListener('keydown', updateInteraction);

    autoScrollTimerRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionTimeRef.current > 4000 && !isAutoScrollingRef.current) {
        triggerAutoScroll();
        lastInteractionTimeRef.current = Date.now(); // 連発防止
      }
    }, 1000);
  };

  const triggerAutoScroll = () => {
    const fixedSection = document.querySelector('.fixed-section') as HTMLElement;
    if (!fixedSection || !lenisRef.current) return;

    const totalHeight = fixedSection.offsetHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const oneSectionHeight = totalHeight / 10;
    let nextScroll = currentScroll + oneSectionHeight;

    if (nextScroll > totalHeight - 10) {
      isAutoScrollingRef.current = true;
      lenisRef.current.scrollTo(0, {
        immediate: true, lock: true, onComplete: () => { isAutoScrollingRef.current = false; }
      });
    } else {
      isAutoScrollingRef.current = true;
      lenisRef.current.scrollTo(nextScroll, {
        duration: 2.5, lock: true, onComplete: () => { isAutoScrollingRef.current = false; }
      });
    }
  };

  // ==========================================
  //  スクロール連動アニメーション (GSAP)
  // ==========================================
  const initScrollAnimation = () => {
    const totalSections = 10;
    const progressFill = document.getElementById("progress-fill");
    const backgrounds = document.querySelectorAll(".background-image");
    const featuredContents = document.querySelectorAll(".featured-content");
    let currentSection = 0;

    ScrollTrigger.create({
      trigger: ".fixed-section", start: "top top", end: "bottom bottom", scrub: 0,
      onUpdate: (self) => {
        const progress = self.progress;
        if (progressFill) progressFill.style.width = `${progress * 100}%`;

        const newSection = Math.min(Math.floor(progress * totalSections), totalSections - 1);
        if (newSection !== currentSection) {
          backgrounds.forEach((bg, i) => {
            if (i === newSection) {
              gsap.to(bg, { opacity: 1, duration: 0.5 });
              bg.classList.add('active');
            } else {
              gsap.to(bg, { opacity: 0, duration: 0.5 });
              bg.classList.remove('active');
            }
          });
          featuredContents.forEach((fc, i) => {
            if (i === newSection) {
              gsap.fromTo(fc, { opacity: 0, y: 20, visibility: 'hidden' }, { opacity: 1, y: 0, visibility: 'visible', duration: 0.5 });
            } else {
              gsap.to(fc, { opacity: 0, y: -20, duration: 0.5, visibility: 'hidden' });
            }
          });
          currentSection = newSection;
        }
      }
    });
  };

  // ==========================================
  //  モーダル制御
  // ==========================================
  const handleMenuClick = (category: string) => {
    lastInteractionTimeRef.current = Date.now();
    setModalTitle(category);

    const filtered = DUMMY_ITEMS.filter(item => item.category === category || category === "Vegetables");
    setModalItems(filtered.length > 0 ? filtered : DUMMY_ITEMS);

    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');

    if (modal && modalContent) {
      modal.classList.remove('invisible', 'opacity-0');
      modalContent.classList.remove('translate-y-10');
      if (lenisRef.current) lenisRef.current.stop();
    }
  };

  const handleCloseModal = () => {
    lastInteractionTimeRef.current = Date.now();
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');
    if (modal && modalContent) {
      modal.classList.add('invisible', 'opacity-0');
      modalContent.classList.add('translate-y-10');
      if (lenisRef.current) lenisRef.current.start();
    }
  };

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      sessionStorage.removeItem('harvest_is_logged_in'); // 記憶を消す
      setIsLoggedIn(false); // 画面を未ログイン状態に戻す
    }
  };

  return (
    <main className="text-stone-800 antialiased">

      {/* 1. ローディング画面 */}
      <div id="loading-overlay" className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f9f8f4] text-2xl tracking-widest text-stone-600">
        HARVEST LOADING...
      </div>

      {/* ========================================== */}
      {/* 2. ログインボタン / ユーザーアイコン (右上) */}
      {/* ========================================== */}
      <header className="fixed top-0 right-0 p-6 z-[60]">
        {isLoggedIn ? (
          // ログイン済み: ユーザーアイコン
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 animate-fade-in-up cursor-pointer hover:bg-black/40 transition-colors"
            title="クリックしてログアウト"
          >
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-white/70 tracking-widest uppercase">Welcome</p>
              <p className="text-xs text-white font-bold">Guest User</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold">
              G
            </div>
          </div>
        ) : (
          // 未ログイン: LOGINボタン
          <Link
            href="/login"
            className="group flex items-center gap-2 text-white font-bold tracking-widest text-xs md:text-sm hover:text-green-400 transition-colors drop-shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform duration-300"></span>
            LOGIN / JOIN
          </Link>
        )}
      </header>

      {/* 3. 商品一覧モーダル */}
      <div
        id="product-modal"
        className="fixed inset-0 z-[9999] opacity-0 invisible transition-all duration-500 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" onClick={handleCloseModal}></div>

        <div
          id="modal-content"
          className="relative bg-[#faf9f6] w-[95%] md:w-[85%] max-w-7xl h-[85vh] rounded-xl shadow-2xl flex flex-col transform translate-y-10 transition-transform duration-500 overflow-hidden pointer-events-auto"
        >
          {/* ヘッダー */}
          <div className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-100 z-10 sticky top-0">
            <div>
              <p className="text-xs text-green-600 font-bold tracking-widest uppercase mb-1">Select Item</p>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800 italic">{modalTitle}</h2>
            </div>
            <button
              onClick={handleCloseModal}
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-stone-800 transition-colors duration-300"
            >
              <span className="text-2xl text-stone-500 group-hover:text-white transition-colors">×</span>
            </button>
          </div>

          {/* 商品リスト ("いいとこ取り"デザイン) */}
          <div className="overflow-y-auto flex-1 p-6 md:p-10 bg-[#faf9f6]" data-lenis-prevent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">

              {modalItems.map((item) => (
                <div key={item.id} className="group flex flex-col cursor-pointer" onClick={() => window.location.href = `/items/detail?id=${item.id}`}>

                  {/* 画像エリア + 緑ボタン */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-200 shadow-sm mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${item.name} をカートに入れました！`);
                      }}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 transform group-hover:scale-110 active:scale-95 z-10"
                    >
                      <span className="text-xl font-bold mb-0.5">＋</span>
                    </button>
                  </div>

                  {/* テキスト情報 (太字・価格横配置) */}
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg font-bold text-stone-800 leading-tight mb-1 group-hover:text-green-700 transition-colors">
                        {item.name}
                      </h3>
                      <p className="font-mono text-lg font-bold text-green-600 shrink-0 ml-2">
                        ¥{item.price}
                      </p>
                    </div>
                    <p className="text-xs text-stone-400 font-medium tracking-wide uppercase">
                      {item.producer}
                    </p>
                  </div>
                </div>
              ))}

            </div>
            {modalItems.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 opacity-50">
                <p className="font-serif text-2xl">Coming Soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. メインアニメーションエリア */}
      <div className="scroll-container">
        <div className="fixed-section">
          <div className="fixed-container">
            <div className="background-container">
              {/* 画像 (public/images に配置してね) */}
              <img src="/images/bg1.webp" className="background-image active" decoding="async" alt="bg" />
              <img src="/images/bg2.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg3.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg4.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg5.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg6.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg7.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg8.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg9.webp" className="background-image" decoding="async" alt="bg" />
              <img src="/images/bg10.webp" className="background-image" decoding="async" alt="bg" />
            </div>

            <div className="grid-container">
              <div className="header text-white drop-shadow-lg" style={{ top: '15vh' }}>
                <div className="text-[10vw] leading-none font-medium tracking-tight">Grand Market</div>
              </div>

              <div className="main-content-row">
                <div
                  className="left-column flex flex-col gap-3 text-white drop-shadow-md text-xl md:text-2xl font-light z-20 relative"
                  style={{ marginTop: '2vh' }}
                >
                  {["Vegetables", "Seafood", "Mushrooms", "Fruits", "Rice", "Wild Plants", "Eggs", "Honey"].map((item) => (
                    <div key={item} className="artist cursor-pointer hover:text-green-300 transition-colors" onClick={() => handleMenuClick(item)}>{item}</div>
                  ))}
                </div>

                <div className="featured relative w-1/2 h-auto text-left" style={{ marginLeft: 'auto', marginRight: 'auto', top: '5vh' }}>
                  <div className="featured-content text-white font-serif active" style={{ fontSize: '3vw', lineHeight: '1.4', opacity: 1, visibility: 'visible' }}>
                    旬を、手渡す。<br />
                    <span style={{ fontSize: '1.5vw', opacity: 0.8 }}>大地の恵みを、そのまま食卓へ。</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 self-end pb-10 text-center text-white/80">
                <div className="w-48 h-[2px] bg-white/30 mx-auto relative overflow-hidden">
                  <div id="progress-fill" className="absolute left-0 top-0 h-full w-0 bg-white"></div>
                </div>
                <p className="mt-3 text-sm tracking-widest">SCROLL TO EXPLORE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}