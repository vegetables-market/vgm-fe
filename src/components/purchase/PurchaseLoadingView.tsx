export function PurchaseLoadingView() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-500"></div>
        <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
      </div>
    </div>
  );
}
