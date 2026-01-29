import Link from 'next/link';
import { Headers } from 'next/dist/lib/load-custom-routes';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900 px-4 text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-zinc-800">404</h1>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          お探しのページは見つかりませんでした。
        </p>
      </div>

      <Link
        href="/"
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
