import StockEditClient from "./StockEditClient";

// 静的書き出し用の設定：ビルドを通すためのダミーIDを返す
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function StockEditPage() {
  return <StockEditClient />;
}
