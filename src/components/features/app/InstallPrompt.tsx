"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { FaDownload, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function InstallPrompt() {
  const { isInstallable, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if not installable or user manually dismissed it this session
  if (!isInstallable || isDismissed) return null;

  return (
    <div className="animate-fade-in-up fixed right-4 bottom-4 left-4 z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg md:right-4 md:left-auto md:w-96 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
            アプリとしてインストール
          </h3>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            ホーム画面に追加して、より快適に利用しましょう。
          </p>
          <button
            onClick={installApp}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <FaDownload />
            インストール
          </button>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="閉じる"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}
