"use client";

import { useEffect } from "react";
import { initMessaging } from "@/lib/firebase/messaging";

export default function FCMHandler() {
  useEffect(() => {
    const setupFCM = async () => {
      // ページが開かれたらすぐにフォアグラウンド通知の監視を開始
      console.log("FCM Handler: Starting foreground listener...");
      await initMessaging();
    };
    setupFCM();
  }, []);

  return null; // 画面には何も表示しない
}
