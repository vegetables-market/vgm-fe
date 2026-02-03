import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { app } from "./config";

// Service Worker 登録と FCM 初期化
export const initMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) {
    console.log("FCM is not supported in this browser");
    return null;
  }

  try {
    // 既存の Serwist Service Worker を取得
    const registration = await navigator.serviceWorker.ready;
    console.log("Service Worker registered:", registration.scope);

    const messaging = getMessaging(app);

    // フォアグラウンド通知受信
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const { title, body } = payload.notification || {};
      if (title && Notification.permission === "granted") {
        new Notification(title, {
          body: body || "",
          icon: "/icon-192x192.png",
        });
      }
    });

    return { messaging, registration };
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
};

// FCMトークン取得
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const result = await initMessaging();
    if (!result) return null;

    const { messaging, registration } = result;

    // 通知許可を取得
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // VAPIDキー確認
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey || vapidKey === "xxx") {
      console.error("VAPID key is not configured");
      return null;
    }

    // Service Worker を明示的に指定してトークン取得
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration, // ← これが重要！
    });

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
