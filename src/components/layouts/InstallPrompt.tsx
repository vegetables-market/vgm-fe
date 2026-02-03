"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 rounded-lg border bg-white p-4 shadow-lg md:hidden">
      <p className="mb-2 text-sm">
        アプリをインストールしてより快適にご利用ください
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 rounded bg-indigo-600 py-2 text-sm text-white"
        >
          インストール
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-1 rounded bg-gray-200 py-2 text-sm"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
