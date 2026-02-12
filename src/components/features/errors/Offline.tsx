"use client";

import { FaWifi } from "react-icons/fa";

export default function Offline() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-gray-200 p-6 dark:bg-gray-800">
          <FaWifi className="h-12 w-12 text-gray-500 dark:text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          オフラインです
        </h1>
        <p className="max-w-md text-gray-600 dark:text-gray-400">
          インターネットに接続されていません。接続を確認してから再読み込みしてください。
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          再読み込み
        </button>
      </div>
    </div>
  );
}
