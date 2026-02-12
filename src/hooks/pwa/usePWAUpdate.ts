"use client";

import { useState, useEffect } from "react";

export function usePWAUpdate() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // 登録済みのService Workerを取得
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
      });

      // 新しいService Workerがアクティブになったらリロードする
      const handleControllerChange = () => {
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleControllerChange,
      );

      return () => {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          handleControllerChange,
        );
      };
    }
  }, []);

  const updatePWA = async () => {
    if (!registration) {
      console.log("No service worker registration found.");
      // Service Workerがない環境でもリロードくらいはしてもいいかもしれない
      window.location.reload();
      return;
    }

    try {
      console.log("Checking for updates...");
      await registration.update();
      console.log("Update check completed.");
    } catch (error) {
      console.error("Failed to update SW:", error);
    }
  };

  return { updatePWA, isSWRegistered: !!registration };
}

