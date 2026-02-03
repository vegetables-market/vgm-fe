import StockDetailClient from "./StockDetailClient";

// 静的書き出し用の設定：ビルドを通すためのダミーIDを教える
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function StockDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <StockDetailClient params={params} />;
}
