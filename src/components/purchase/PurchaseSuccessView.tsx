import Link from "next/link";

export function PurchaseSuccessView() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          購入が完了しました
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          ご注文ありがとうございます。
          <br />
          商品の発送まで今しばらくお待ちください。
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-red-500 px-8 py-3 font-bold text-white transition-colors hover:bg-red-600"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
