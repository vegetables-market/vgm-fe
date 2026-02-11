import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// 1. グローバル変数の型定義
// Service Worker 内で使用されるグローバルスコープとマニフェスト変数を宣言します
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// 2. Serwist のインスタンス化と設定
const serwist = new Serwist({
  // ビルド時に生成されるプリキャッシュのリストを注入
  precacheEntries: self.__SW_MANIFEST,

  // 新しい Service Worker がインストールされたらすぐに有効化 (通常 true 推奨)
  skipWaiting: true,

  // 有効化されたらすぐにページをコントロール下に置く
  clientsClaim: true,

  // ナビゲーションプリロードを無効化
  // Next.js の SPA クライアントサイドルーティングと競合し、
  // preloadResponse が settle する前にナビゲーションがキャンセルされる問題を回避
  navigationPreload: false,

  // 3. ランタイムキャッシュ設定
  // defaultCache は Next.js の画像、JS、CSS、Google Fonts などを適切にキャッシュする設定セットです
  // api.ts にあるような動的な API コール (/api/auth など) はデフォルトではキャッシュされません
  runtimeCaching: defaultCache,
});

// 4. イベントリスナーの登録
serwist.addEventListeners();

// 5. オフラインフォールバックの設定
// ナビゲーションリクエストが失敗した場合（オフライン時）、/offline.html を返します
serwist.setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    const offlinePage = await serwist.matchPrecache("/offline.html");
    if (offlinePage) {
      return offlinePage;
    }
    // プリキャッシュに見つからない場合は /offline を試す（念のため）
    const offlineRoute = await serwist.matchPrecache("/offline");
    if (offlineRoute) {
      return offlineRoute;
    }
  }
  return Response.error();
});
