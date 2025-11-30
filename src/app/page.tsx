"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 追加
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from '@studio-freight/lenis';

// GSAPプラグイン登録
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("customEase", "M0,0 C0.86,0 0.07,1 1,1");
}

// ==========================================
//  ダミーデータ
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

// 背景画像のリスト
const BG_IMAGES = [
  "/images/bg1.webp", "/images/bg2.webp", "/images/bg3.webp", "/images/bg4.webp",
  "/images/bg5.webp", "/images/bg6.webp", "/images/bg7.webp", "/images/bg8.webp",
  "/images/bg9.webp", "/images/bg10.webp"
];

let hasPlayedOpening = false;

export default function Home() {
  const router = useRouter();

  // Refs (DOMへの参照)
  const lenisRef = useRef<Lenis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fixedSectionRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  // 配列のRef管理テクニック
  const bgImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const featuredContentsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Logic Refs
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const isAutoScrollingRef = useRef<boolean>(false);
  const currentIndexRef = useRef<number>(0);

  // State
  const [modalItems, setModalItems] = useState<typeof DUMMY_ITEMS>([]);
  const [modalTitle, setModalTitle] = useState("CATEGORY");
  const [isModalOpen, setIsModalOpen] = useState(false); // Stateで管理に変更
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ==========================================
  //  初期化 & 起動プロセス
  // ==========================================
  useEffect(() => {
    // 1. Lenis
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. ログインチェック
    if (sessionStorage.getItem('harvest_is_logged_in')) {
      setIsLoggedIn(true);
    }

    // メインロジック開始関数
    const startMainLogic = () => {
      initScrollAnimation();
      startAutoScrollLoop();
    };

    // ページ遷移アニメーション (Loginから戻ってきた時のフワッ)
    if (scrollContainerRef.current) {
      gsap.fromTo(scrollContainerRef.current,
        { x: 100, opacity: 0, filter: "blur(5px)" },
        {
          x: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "circ.out",
          clearProps: "transform,filter",
          onComplete: () => ScrollTrigger.refresh()
        }
      );
    }

    // 3. オープニングアニメーション制御 (修正版)
    // hasPlayedOpening はリロードすると false に戻るが、
    // Next.js内のページ遷移(Link)では true のまま生き残る。
    if (!hasPlayedOpening && overlayRef.current) {
      // --- A. F5 または 初回アクセス (まだ見てない) ---
      hasPlayedOpening = true; // 見たよフラグを立てる

      // 表示状態にする
      overlayRef.current.style.visibility = 'visible';
      overlayRef.current.style.opacity = '1';

      setTimeout(() => {
        if (!overlayRef.current) return;
        gsap.to(overlayRef.current, {
          y: "-100%", duration: 1, ease: "power3.inOut",
          onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.display = 'none';
            startMainLogic();
          }
        });
      }, 1500);
    } else {
      // --- B. ページ遷移で戻ってきた時 (もう見た) ---
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      startMainLogic();
    }

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ==========================================
  //  機能ロジック
  // ==========================================

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      sessionStorage.removeItem('harvest_is_logged_in');
      setIsLoggedIn(false);
    }
  };

  const startAutoScrollLoop = () => {
    const updateInteraction = () => { lastInteractionTimeRef.current = Date.now(); };
    window.addEventListener('wheel', updateInteraction);
    window.addEventListener('touchmove', updateInteraction);
    window.addEventListener('click', updateInteraction);
    window.addEventListener('keydown', updateInteraction);

    autoScrollTimerRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionTimeRef.current > 7000 && !isAutoScrollingRef.current) {
        triggerAutoScroll();
        lastInteractionTimeRef.current = Date.now();
      }
    }, 1000);
  };

  const triggerAutoScroll = () => {
    // Refを使用
    if (!fixedSectionRef.current || !lenisRef.current || bgImagesRef.current.length === 0) return;

    const totalHeight = fixedSectionRef.current.offsetHeight - window.innerHeight;
    const totalSections = bgImagesRef.current.length;
    const oneSectionHeight = totalHeight / totalSections;

    let nextIndex = currentIndexRef.current + 1;

    if (nextIndex >= totalSections) {
      isAutoScrollingRef.current = true;
      lenisRef.current.scrollTo(0, {
        immediate: true, lock: true,
        onComplete: () => {
          isAutoScrollingRef.current = false;
          currentIndexRef.current = 0;
        }
      });
    } else {
      const nextScrollPos = nextIndex * oneSectionHeight;
      const targetPos = nextScrollPos + 10;

      isAutoScrollingRef.current = true;
      lenisRef.current.scrollTo(targetPos, {
        duration: 3.5, lock: true,
        onComplete: () => {
          isAutoScrollingRef.current = false;
          currentIndexRef.current = nextIndex;
        }
      });
    }
  };

  const initScrollAnimation = () => {
    const totalSections = bgImagesRef.current.length;
    let lastSectionIndex = -1; // ★追加: 直前のセクション番号を覚えておく変数

    ScrollTrigger.create({
      trigger: fixedSectionRef.current, // Ref指定
      start: "top top", end: "bottom bottom", scrub: 0,
      onUpdate: (self) => {
        const progress = self.progress;
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${progress * 100}%`;
        }

        const newSection = Math.min(Math.floor(progress * totalSections), totalSections - 1);

        // ★修正ポイント:
        // 「前回と同じセクション番号」なら、アニメーション処理をスキップする！
        if (newSection !== lastSectionIndex) {

          // 変更があった時だけ更新
          lastSectionIndex = newSection;
          currentIndexRef.current = newSection;

          // Ref配列を使って制御
          bgImagesRef.current.forEach((bg, i) => {
            if (!bg) return;
            if (i === newSection) {
              gsap.to(bg, { opacity: 1, duration: 0.5 });
              bg.classList.add('active');
            } else {
              gsap.to(bg, { opacity: 0, duration: 0.5 });
              bg.classList.remove('active');
            }
          });

          featuredContentsRef.current.forEach((fc, i) => {
            if (!fc) return;
            if (i === newSection) {
              // ここが点滅の原因だった。切り替わった瞬間だけ走るようにしたからOK
              gsap.fromTo(fc, { opacity: 0, y: 20, visibility: 'hidden' }, { opacity: 1, y: 0, visibility: 'visible', duration: 0.5 });
            } else {
              gsap.to(fc, { opacity: 0, y: -20, duration: 0.5, visibility: 'hidden' });
            }
          });
        }
      }
    });
  };

  // モーダル制御 (State管理に変更)
  const handleMenuClick = (category: string) => {
    lastInteractionTimeRef.current = Date.now();
    setModalTitle(category);
    const filtered = DUMMY_ITEMS.filter(item => item.category === category || category === "Vegetables");
    setModalItems(filtered.length > 0 ? filtered : DUMMY_ITEMS);

    setIsModalOpen(true);
    if (lenisRef.current) lenisRef.current.stop();
  };

  const handleCloseModal = () => {
    lastInteractionTimeRef.current = Date.now();
    setIsModalOpen(false);
    if (lenisRef.current) lenisRef.current.start();
  };

  return (
    <main className="text-stone-800 antialiased">
      {/* 1. ローディング画面 */}
      <div
        ref={overlayRef}
        id="loading-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f9f8f4] text-2xl tracking-widest text-stone-600 opacity-0 invisible"
      >
        HARVEST LOADING...
      </div>

      {/* 2. ヘッダー */}
      <header className="fixed top-0 right-0 p-6 z-[60]">
        {isLoggedIn ? (
          <div onClick={handleLogout} className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 cursor-pointer hover:bg-black/40 transition-colors">
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-white/70 tracking-widest uppercase">Welcome</p>
              <p className="text-xs text-white font-bold">Guest User</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold">G</div>
          </div>
        ) : (
          <Link href="/login" className="group flex items-center gap-2 text-white font-bold tracking-widest text-xs md:text-sm hover:text-green-400 transition-colors drop-shadow-md">
            <span className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform duration-300"></span>
            LOGIN / JOIN
          </Link>
        )}
      </header>

      {/* 3. モーダル (StateとTailwindクラスで制御) */}
      <div
        className={`fixed inset-0 z-[9999] transition-all duration-500 flex items-center justify-center ${isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" onClick={handleCloseModal}></div>
        <div className={`relative bg-[#faf9f6] w-[95%] md:w-[85%] max-w-7xl h-[85vh] rounded-xl shadow-2xl flex flex-col transition-transform duration-500 overflow-hidden pointer-events-auto ${isModalOpen ? "translate-y-0" : "translate-y-10"
          }`}>
          {/* モーダルの中身は変更なし */}
          <div className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-100 z-10 sticky top-0">
            <div><p className="text-xs text-green-600 font-bold tracking-widest uppercase mb-1">Select Item</p><h2 className="text-3xl md:text-4xl font-serif text-stone-800 italic">{modalTitle}</h2></div>
            <button onClick={handleCloseModal} className="group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-stone-800 transition-colors duration-300"><span className="text-2xl text-stone-500 group-hover:text-white transition-colors">×</span></button>
          </div>
          <div className="overflow-y-auto flex-1 p-6 md:p-10 bg-[#faf9f6]" data-lenis-prevent>
            {/* ... 商品リスト部分 ... */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
              {modalItems.map((item) => (
                <div key={item.id} className="group flex flex-col cursor-pointer" onClick={() => router.push(`/items/detail?id=${item.id}`)}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-200 shadow-sm mb-4">
                    {/* 外部画像もNext/Imageを使うにはnext.config.tsの設定が必要だが、一旦imgのままでも可。ただしwarning出る */}
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div>
                    <div className="flex justify-between items-start"><h3 className="font-serif text-lg font-bold text-stone-800 leading-tight mb-1 group-hover:text-green-700 transition-colors">{item.name}</h3><p className="font-mono text-lg font-bold text-green-600 shrink-0 ml-2">¥{item.price}</p></div>
                    <p className="text-xs text-stone-400 font-medium tracking-wide uppercase">{item.producer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. メインコンテンツ */}
      <div ref={scrollContainerRef} className="scroll-container">
        <div ref={fixedSectionRef} className="fixed-section">
          <div className="fixed-container">
            <div className="background-container">
              {BG_IMAGES.map((src, index) => (
                // next/image を使用。fillプロパティで親要素いっぱいに広げる
                <div
                  key={src}
                  ref={el => { bgImagesRef.current[index] = el }} // Ref配列に格納
                  className={`background-image absolute top-0 left-0 w-full h-full ${index === 0 ? 'active' : ''}`}
                  style={{ opacity: index === 0 ? 1 : 0 }}
                >
                  <Image
                    src={src}
                    alt="bg"
                    fill
                    priority={index === 0} // 1枚目は優先読み込み
                    className="object-cover object-center brightness-75"
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>

            <div className="grid-container">
              <div className="header text-white drop-shadow-lg" style={{ top: '15vh' }}>
                <div className="text-[10vw] leading-none font-medium tracking-tight">Grand Market</div>
              </div>
              <div className="main-content-row">
                <div className="left-column flex flex-col gap-3 text-white drop-shadow-md text-xl md:text-2xl font-light z-20 relative" style={{ marginTop: '2vh' }}>
                  {["Vegetables", "Seafood", "Mushrooms", "Fruits", "Rice", "Wild Plants", "Eggs", "Honey"].map((item) => (
                    <div key={item} className="artist cursor-pointer hover:text-green-300 transition-colors" onClick={() => handleMenuClick(item)}>{item}</div>
                  ))}
                </div>
                <div className="featured relative w-1/2 h-auto text-left" style={{ marginLeft: 'auto', marginRight: 'auto', top: '5vh' }}>
                  {/* コンテンツもRef配列で管理 */}
                  {BG_IMAGES.map((_, i) => (
                    <div
                      key={i}
                      ref={el => { featuredContentsRef.current[i] = el }}
                      className="featured-content text-white font-serif absolute top-0 left-0 w-full"
                      style={{
                        fontSize: '3vw', lineHeight: '1.4',
                        opacity: i === 0 ? 1 : 0,
                        visibility: i === 0 ? 'visible' : 'hidden'
                      }}
                    >
                      旬を、手渡す。<br />
                      <span style={{ fontSize: '1.5vw', opacity: 0.8 }}>大地の恵みを、そのまま食卓へ。</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 self-end pb-10 text-center text-white/80">
                <div className="w-48 h-[2px] bg-white/30 mx-auto relative overflow-hidden">
                  <div ref={progressFillRef} id="progress-fill" className="absolute left-0 top-0 h-full w-0 bg-white"></div>
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