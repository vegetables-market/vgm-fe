import CategoryDetailClient from "./CategoryDetailClient";

// 静的サイト生成(SSG)のためのパラメータ設定
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function CategoryDetailPage() {
  return <CategoryDetailClient />;
}
