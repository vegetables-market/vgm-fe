// @ts-nocheck - Service Worker内でのCDN動的インポート用

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { initializeApp } from "firebase/app"; // 静的インポートに変更
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw"; // Service Worker用

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Service Worker Clients API型定義
declare const clients: {
  matchAll(options?: {
    type?: "window" | "worker" | "sharedworker" | "all";
    includeUncontrolled?: boolean;
  }): Promise<readonly Client[]>;
  openWindow(url: string): Promise<WindowClient | null>;
};

interface Client {
  readonly url: string;
  focus(): Promise<WindowClient>;
}

interface WindowClient extends Client {
  readonly focused: boolean;
  readonly visibilityState: "hidden" | "visible" | "prerender";
}

// Serwist 設定
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// オフラインフォールバック
serwist.setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    const offlinePage = await serwist.matchPrecache("/offline.html");
    if (offlinePage) return offlinePage;
    const offlineRoute = await serwist.matchPrecache("/offline");
    if (offlineRoute) return offlineRoute;
  }
  return Response.error();
});

// ==================== FCM 統合 ====================

// Firebase設定値（直接記述 - 開発・本番兼用）
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBweYLGemAjCB563iaX_fWyiifnKnQAqzI",
  authDomain: "grandmarket-app.firebaseapp.com",
  projectId: "grandmarket-app",
  storageBucket: "grandmarket-app.firebasestorage.app",
  messagingSenderId: "781534657518",
  appId: "1:781534657518:web:dee35807061db11498acff",
};

const app = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log("[SW] Background message received:", payload);
  console.log("[SW] Notification permission state:", Notification.permission); // これを追加

  if (Notification.permission !== "granted") {
    console.error("[SW] Permission not granted!");
    return;
  }
  // 通知を表示するロジック
  const notificationTitle = payload.notification?.title || "新着通知";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/icon-192x192.png",
    tag: "fcm-group",
    data: payload.data,
  };
});

console.log("[SW] FCM initialized successfully");

// 通知クリックハンドラ
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification);
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
