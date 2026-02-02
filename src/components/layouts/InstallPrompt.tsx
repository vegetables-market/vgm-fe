"use client";

import { useState, useEffect } from "react";
import { IoClose, IoDownloadOutline } from "react-icons/io5";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 既にPWAとしてインストールされている場合は表示しない
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // 以前に非表示にした場合は表示しない
    const dismissedAt = localStorage.getItem("installPromptDismissed");
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const now = new Date();
      // 7日間は再表示しない
      if (now.getTime() - dismissedDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("installPromptDismissed", new Date().toISOString());
  };

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-50">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        aria-label="閉じる"
      >
        <IoClose className="text-xl" />
      </button>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
          <IoDownloadOutline className="text-xl text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            アプリをインストール
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ホーム画面に追加して、より快適にご利用いただけます
          </p>
          <button
            onClick={handleInstall}
            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            インストール
          </button>
        </div>
      </div>
    </div>
  );
}
