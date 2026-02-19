import Link from "next/link";

export default function NotFound404() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-zinc-900">
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-zinc-800">
          404
        </h1>
        <p className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
          Page Not Found
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          お探しのページは見つかりませんでした。
        </p>
      </div>

      <Link
        href="/"
        className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-green-700 hover:shadow-xl"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
