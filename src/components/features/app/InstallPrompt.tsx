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
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-fade-in-up">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        アプリとしてインストール
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        ホーム画面に追加して、より快適に利用しましょう。
                    </p>
                    <button
                        onClick={installApp}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        <FaDownload />
                        インストール
                    </button>
                </div>
                <button
                    onClick={() => setIsDismissed(true)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                    aria-label="閉じる"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
}
