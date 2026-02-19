"use client";

import { usePWAInstallPrompt } from "@/hooks/pwa/usePWAInstallPrompt";

export default function InstallPrompt() {
  const { variant, install, dismiss } = usePWAInstallPrompt();

  if (!variant) return null;

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
            onClick={dismiss}
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
        {variant === "chromium" ? (
          <button
            onClick={install}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            インストールする
          </button>
        ) : variant === "ios" ? (
          <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
            <div className="font-medium">iPhone / iPad の場合</div>
            <div className="mt-1">
              共有ボタンから「ホーム画面に追加」を選択してください。
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
            <div className="font-medium">このブラウザの場合</div>
            <div className="mt-1">
              ブラウザのメニューから「ホーム画面に追加」または「アプリをインストール」を選択してください。
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
