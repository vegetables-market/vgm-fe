"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg md:right-4 md:left-auto md:w-96 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              アプリをインストール
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              ホーム画面に追加して、より快適に利用できます。
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">閉じる</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={handleInstallClick}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          インストールする
        </button>
      </div>
    </div>
  );
}
