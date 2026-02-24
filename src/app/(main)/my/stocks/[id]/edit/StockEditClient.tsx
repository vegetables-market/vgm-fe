"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/service/market/stocks/get-categories";
import type { Category } from "@/service/market/stocks/get-categories";
import { updateItem } from "@/service/market/stocks/update-item";
import { fetchApi } from "@/lib/api/fetch";
import { useMultiImageUpload } from "@/hooks/item/useMultiImageUpload";

interface ItemDetail {
  itemId: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  quantity: number;
  shippingPayerType: number;
  shippingOriginArea: number;
  shippingDaysId: number;
  shippingMethodId: number;
  itemCondition: number;
  images: Array<{
    imageId: number;
    imageUrl: string;
    displayOrder: number;
  }>;
}

export default function StockEditClient({ id }: { id: string }) {
  const router = useRouter();
  const itemId = id;

  const { files, addFiles, removeFile, hasError, pendingCount } =
    useMultiImageUpload(itemId);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");

  // Constants (Mock Masters for now)
  const shippingDaysOptions = [
    { id: 1, name: "1~2日で発送" },
    { id: 2, name: "2~3日で発送" },
    { id: 3, name: "4~7日で発送" },
  ];
  const shippingMethodOptions = [
    { id: 1, name: "未定" },
    { id: 2, name: "らくらくメルカリ便" },
  ];
  const prefectureOptions = [
    { id: 13, name: "東京都" },
    { id: 27, name: "大阪府" },
  ];

  const [shippingDaysId, setShippingDaysId] = useState(1);
  const [shippingMethodId, setShippingMethodId] = useState(1);
  const [prefectureId, setPrefectureId] = useState(13);
  const [shippingPayerType, setShippingPayerType] = useState(0);
  const [itemCondition, setItemCondition] = useState(0);

  // Load existing item data
  useEffect(() => {
    const loadItemData = async () => {
      try {
        const data = await fetchApi<{ item: ItemDetail }>(
          `/v1/market/items/${itemId}`,
          {
            credentials: "include",
          },
        );

        const item = data.item;
        setName(item.name);
        setDescription(item.description || "");
        setCategoryId(item.categoryId);
        setPrice(item.price.toString());
        setQuantity(item.quantity.toString());
        setShippingPayerType(item.shippingPayerType);
        setPrefectureId(item.shippingOriginArea);
        setShippingDaysId(item.shippingDaysId);
        setShippingMethodId(item.shippingMethodId);
        setItemCondition(item.itemCondition);

        setDataLoading(false);
      } catch (err) {
        console.error(err);
        setError("商品データの読み込みに失敗しました");
        setDataLoading(false);
      }
    };

    loadItemData();

    // Fetch categories
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, [itemId]);

  // Drag & Drop Handlers
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(Array.from(e.dataTransfer.files));
      }
    },
    [addFiles],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (pendingCount > 0) {
      setError("画像のアップロード中です。完了まで待ってください。");
      return;
    }

    if (hasError) {
      setError(
        "画像のアップロードでエラーが発生しています。再アップロードしてください。",
      );
      return;
    }

    if (!name || !description || !price || !categoryId) {
      setError("必須項目を入力してください。");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        categoryId: Number(categoryId),
        price: Number(price),
        quantity: Number(quantity),
        shippingPayerType: shippingPayerType,
        shippingOriginArea: prefectureId,
        shippingDaysId: shippingDaysId,
        shippingMethodId: shippingMethodId,
        itemCondition: itemCondition,
      };

      await updateItem(itemId, payload);
      router.push("/my/stocks");
    } catch (err) {
      console.error(err);
      setError("更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">商品の編集</h1>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 画像アップロードUI */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            商品画像
          </label>

          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:bg-gray-50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <p className="text-gray-500">
              ドラッグ&ドロップ または クリックして画像を追加
            </p>
          </div>

          {/* プレビューグリッド */}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group relative aspect-square overflow-hidden rounded-md border bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.previewUrl}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />

                  {/* Overlay for status */}
                  <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>

                  {/* Status Indicator */}
                  {file.status !== "completed" && (
                    <div className="absolute right-0 bottom-0 left-0 h-1 bg-gray-200">
                      <div
                        className={`h-full ${file.status === "error" ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}

                  {file.status === "error" && (
                    <>
                      <div className="absolute top-0 right-0 bg-red-500 px-1 text-xs text-white">
                        Error
                      </div>
                      {file.error && (
                        <div className="absolute right-0 bottom-0 left-0 bg-red-600/90 px-1 py-0.5 text-[10px] text-white">
                          {file.error}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 text-right text-sm text-gray-500">
            {files.length}枚の画像 (アップロード済み: {" "}
            {files.filter((f) => f.status === "completed").length})
          </div>
        </div>

        {/* 商品情報 */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            商品名 (必須)
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            商品の説明 (必須)
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* カテゴリー */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            カテゴリー (必須)
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            <option value="" className="text-gray-900">
              選択してください
            </option>
            {categories.map((cat) => (
              <option
                key={cat.categoryId}
                value={cat.categoryId}
                className="text-gray-900"
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 商品の状態 */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            商品の状態
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={itemCondition}
            onChange={(e) => setItemCondition(Number(e.target.value))}
          >
            <option value="0" className="text-gray-900">
              新品・未使用
            </option>
            <option value="1" className="text-gray-900">
              未使用に近い
            </option>
            <option value="2" className="text-gray-900">
              目立った傷や汚れなし
            </option>
          </select>
        </div>

        {/* 送料について */}
        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            送料について
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                送料負担の区分
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm"
                value={shippingPayerType}
                onChange={(e) => setShippingPayerType(Number(e.target.value))}
              >
                <option value="0" className="text-gray-900">
                  送料込み (出品者負担)
                </option>
                <option value="1" className="text-gray-900">
                  着払い (購入者負担)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                発送元の地域
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm"
                value={prefectureId}
                onChange={(e) => setPrefectureId(Number(e.target.value))}
              >
                {prefectureOptions.map((p) => (
                  <option key={p.id} value={p.id} className="text-gray-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                発送までの日数
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm"
                value={shippingDaysId}
                onChange={(e) => setShippingDaysId(Number(e.target.value))}
              >
                {shippingDaysOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-gray-900">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                発送方法
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm"
                value={shippingMethodId}
                onChange={(e) => setShippingMethodId(Number(e.target.value))}
              >
                {shippingMethodOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-gray-900">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 価格・在庫 */}
        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">価格と在庫</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                販売価格 (必須)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">¥</span>
                </div>
                <input
                  type="number"
                  className="block w-full rounded-md border border-gray-300 bg-white p-2 pl-7 text-gray-900 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                在庫数
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/my/stocks")}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading || pendingCount > 0}
            className={`flex flex-1 justify-center rounded-md border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm ${
              loading || pendingCount > 0
                ? "bg-gray-400"
                : "bg-red-600 hover:bg-red-700"
            } focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none`}
          >
            {loading
              ? "更新中..."
              : pendingCount > 0
                ? `画像アップロード中 (${pendingCount})`
                : "更新する"}
          </button>
        </div>
      </form>
    </div>
  );
}
