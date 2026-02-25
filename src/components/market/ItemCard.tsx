import Link from "next/link";
import Image from "next/image";

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    images: string[];
    status: string;
    category?: string;
  };
}

export function ItemCard({ item }: ItemCardProps) {
  const isSold = item.status === "sold";

  return (
    <Link href={`/stocks/${item.id}`} className="group block overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
      {/* 画像エリア*/}
      <div className="relative aspect-square w-full bg-gray-100">
        <Image
          src={item.images?.[0] || "/images/no-image.png"}
          alt={item.name}
          fill
          className="object-cover transition group-hover:scale-105"
          unoptimized
        />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">SOLD</span>
          </div>
        )}
      </div>

      {/* テキストエリア */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm text-stone-700">{item.name}</h3>
        <p className="mt-1 text-lg font-bold text-red-600">¥{item.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}