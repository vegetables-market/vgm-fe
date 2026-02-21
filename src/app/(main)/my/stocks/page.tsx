"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyItems } from "@/service/market/stocks/get-my-items";
import { deleteItem } from "@/service/market/stocks/delete-item";
import { updateItemStatus } from "@/service/market/stocks/update-item-status";

interface Item {
  id: number;
  name: string;
  price: number;
  status: number;
  imageUrl: string | null;
  image_url?: string | null;
  createdAt: string;
  created_at?: string;
}

export default function StockPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const loadItems = () => {
    setLoading(true);
    getMyItems()
      .then((data: any[]) => {
        const normalizedItems: Item[] = (data || []).map((item) => ({
          id: Number(item.id ?? item.itemId ?? item.item_id ?? 0),
          name: item.name ?? item.title ?? "",
          price: Number(item.price ?? 0),
          status: Number(item.status ?? 0),
          imageUrl: item.imageUrl ?? item.image_url ?? null,
          image_url: item.image_url ?? item.imageUrl ?? null,
          createdAt: item.createdAt ?? item.created_at ?? "",
          created_at: item.created_at ?? item.createdAt ?? "",
        }));
        setItems(normalizedItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (itemId: number, itemName: string) => {
    if (!confirm(`「${itemName}」を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    setDeleting(itemId);
    try {
      await deleteItem(itemId);
      loadItems(); // 荳隕ｧ繧抵ｿｽE隱ｭ縺ｿ霎ｼ縺ｿ
    } catch (err) {
      console.error(err);
      alert("蜑企勁縺ｫ螟ｱ謨励＠縺ｾ縺励◆");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (itemId: number, currentStatus: number) => {
    // status 2 (蜃ｺ蜩∽ｸｭ) 竍・status 5 (蛛懈ｭ｢荳ｭ) 縺ｮ蛻・・ｽ・ｽ譖ｿ縺・
    const newStatus = currentStatus === 2 ? 5 : 2;
    const statusText = newStatus === 2 ? "蜃ｺ蜩∽ｸｭ" : "蛛懈ｭ｢荳ｭ";

    if (!confirm(`ステータスを「${statusText}」に変更しますか？`)) {
      return;
    }

    setUpdatingStatus(itemId);
    try {
      await updateItemStatus(itemId, newStatus);
      loadItems(); // 荳隕ｧ繧抵ｿｽE隱ｭ縺ｿ霎ｼ縺ｿ
    } catch (err) {
      console.error(err);
      alert("繧ｹ繝・・ｽE繧ｿ繧ｹ縺ｮ譖ｴ譁ｰ縺ｫ螟ｱ謨励＠縺ｾ縺励◆");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 2:
        return <span className="font-bold text-green-600">蜃ｺ蜩∽ｸｭ</span>;
      case 3:
        return <span className="font-bold text-blue-600">蜿門ｼ穂ｸｭ</span>;
      case 4:
        return <span className="font-bold text-gray-600">販売終了</span>;
      case 5:
        return <span className="font-bold text-red-600">蛛懈ｭ｢荳ｭ</span>;
      default:
        return <span>荳搾ｿｽE</span>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  // 蝠・・ｽ・ｽ逕ｻ蜒擾ｿｽEURL繧呈ｧ狗ｯ・
  const getImageUrl = (filename: string | null) => {
    if (!filename) return "/images/no-image.png"; // 繝励Ξ繝ｼ繧ｹ繝帙Ν繝繝ｼ
    // filename縺梧里縺ｫ http... 縺ｧ蟋九∪繧句ｴ蜷茨ｿｽE縺晢ｿｽE縺ｾ縺ｾ縲√◎繧御ｻ･螟厄ｿｽENEXT_PUBLIC_MEDIA_URL繧剃ｻ倅ｸ・
    if (filename.startsWith("http")) return filename;
    const mediaUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    // 譛ｫ蟆ｾ縺ｮ繧ｹ繝ｩ繝・・ｽ・ｽ繝･隱ｿ謨ｴ
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${filename}`;
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">出品中の商品管理</h1>
        <Link
          href="/my/stocks/new"
          className="rounded bg-red-600 px-4 py-2 text-white shadow transition hover:bg-red-700"
        >
          譁ｰ隕擾ｿｽE蜩・
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded bg-white py-12 text-center text-gray-500 shadow">
          蜃ｺ蜩√＠縺ｦ縺・・ｽ・ｽ蝠・・ｽ・ｽ縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・
          <br />
          <Link
            href="/my/stocks/new"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            譛蛻晢ｿｽE蝠・・ｽ・ｽ繧抵ｿｽE蜩√☆繧・
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  蝠・・ｽ・ｽ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  萓｡譬ｼ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  繧ｹ繝・・ｽE繧ｿ繧ｹ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  蜃ｺ蜩∵律譎・
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  謫堺ｽ・
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-14 w-14 flex-shrink-0">
                        <img
                          className="h-14 w-14 rounded border object-cover"
                          src={getImageUrl(item.imageUrl ?? item.image_url ?? null)}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(item.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {new Date(item.createdAt || item.created_at || "").toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {/* 繧ｹ繝・・ｽE繧ｿ繧ｹ蛻・・ｽ・ｽ譖ｿ縺茨ｿｽE繧ｿ繝ｳ・ｽE・ｽ・ｽE蜩∽ｸｭ竍泌●豁｢荳ｭ縺ｮ縺ｿ・ｽE・ｽE*/}
                      {(item.status === 2 || item.status === 5) && (
                        <button
                          onClick={() =>
                            handleToggleStatus(item.id, item.status)
                          }
                          disabled={updatingStatus === item.id}
                          className="text-xs text-blue-600 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingStatus === item.id
                            ? "譖ｴ譁ｰ荳ｭ..."
                            : item.status === 2
                              ? "蛛懈ｭ｢"
                              : "蜀埼幕"}
                        </button>
                      )}
                      <Link
                        href={`/my/stocks/${item.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        邱ｨ髮・
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deleting === item.id}
                        className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleting === item.id ? "蜑企勁荳ｭ..." : "蜑企勁"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
