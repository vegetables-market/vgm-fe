import Link from "next/link";
import Image from "next/image";

interface PurchaseSuccessProps {
  item: {
    itemId: number;
    title: string;
    images: Array<{ imageUrl: string }>;
    seller: { displayName: string };
  };
  orderId?: number;
}

export function PurchaseSuccess({ item, orderId }: PurchaseSuccessProps) {
  const thumbnailUrl = item.images[0]?.imageUrl || "/images/no-image.png";

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* メインの完了カード */}
        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Amazon風の緑チェック */}
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 text-green-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-green-700">ありがとうございます。注文が確定されました。</h1>
              <p className="mt-1 text-sm text-gray-600">
                注文内容と配送状況については、登録済みのメールアドレス宛にお知らせをお送りしました。
              </p>
              
              <div className="mt-6 border-t pt-6">
                <p className="text-sm font-bold">注文番号： <span className="text-blue-600 font-normal">#VGM-{orderId || "---"}</span></p>
                
                <div className="mt-4 flex items-start gap-6">
                  {/* 商品画像 */}
                  <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded border border-gray-100 overflow-hidden">
                    <Image src={thumbnailUrl} alt={item.title} fill className="object-cover" unoptimized />
                  </div>
                  
                  {/* 配送詳細 */}
                  <div className="space-y-1">
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">出品者: {item.seller.displayName}</p>
                    <p className="mt-2 text-orange-700 font-bold text-sm">お届け予定日: 2026年2月26日 - 2月28日</p>
                  </div>
                </div>
              </div>

              {/* アクションリンク */}
              <div className="mt-8 flex items-center gap-4 text-sm text-blue-600">
                <Link href="/" className="hover:underline hover:text-orange-700">買い物を続ける</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}