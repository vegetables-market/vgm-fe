"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/service/market/stocks/get-categories";
import { updateItem } from "@/service/market/stocks/update-item";
import { useItemDraft } from "@/hooks/item/useItemDraft";
import { useMultiImageUpload } from "@/hooks/item/useMultiImageUpload";

export default function StockNewPage() {
  const router = useRouter();
  const { itemId, initDraft, getItemId, loading: draftLoading } = useItemDraft();
  const {
    files,
    addFiles,
    removeFile,
    isAllCompleted,
    hasError,
    pendingCount,
  } = useMultiImageUpload(itemId, { initDraft });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
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
    { id: 2, name: "繧峨￥繧峨￥繝｡繝ｫ繧ｫ繝ｪ萓ｿ" },
  ];
  const prefectureOptions = [
    { id: 13, name: "譚ｱ莠ｬ驛ｽ" },
    { id: 27, name: "大阪府" },
  ];

  const [shippingDaysId, setShippingDaysId] = useState(1);
  const [shippingMethodId, setShippingMethodId] = useState(1);
  const [prefectureId, setPrefectureId] = useState(13);
  const [shippingPayerType, setShippingPayerType] = useState(0); // 0:騾∵侭霎ｼ
  const [itemCondition, setItemCondition] = useState(0); // 0:譁ｰ蜩・

  // Fetch categories on mount (draft is created when first image is added)
    useEffect(() => {
    getCategories()
      .then((data) => {
        console.log("蜿門ｾ励＠縺溘ョ繝ｼ繧ｿ:", data);
        setCategories(data);
      })
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

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
    // file input繧ｯ繝ｪ繧｢
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // State縺ｮitemId縺ｾ縺滂ｿｽERef縺九ｉ蜿門ｾ暦ｼ・eact縺ｮ髱槫酔譛欖tate譖ｴ譁ｰ縺ｫ繧医ｋ繧ｿ繧､繝溘Φ繧ｰ縺壹ｌ繧貞屓驕ｿ・ｽE・ｽE
    let currentItemId = itemId ?? getItemId();
    if (!currentItemId) {
      // 縺ｾ縺Draft縺御ｽ懊ｉ繧後※縺・・ｽ・ｽ縺・・ｽ・ｽ蜷茨ｿｽE菴懶ｿｽE繧定ｩｦ縺ｿ繧・
      try {
        currentItemId = await initDraft();
      } catch {
        setError("Draft Item initialization failed. Please reload.");
        return;
      }
    }

    if (!currentItemId) {
      setError("Draft Item initialization failed. Please reload.");
      return;
    }

    if (files.length === 0) {
      setError("画像を1枚以上選択してください。");
      return;
    }

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

    // 譌｢縺ｫ螳御ｺ・・ｽ・ｽ縺ｦ縺・・ｽ・ｽ縺代ｌ縺ｰ繝√ぉ繝・・ｽ・ｽ
    if (!isAllCompleted) {
      setError("画像アップロードの完了を待ってください。");
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
        category_id: Number(categoryId),
        price: Number(price),
        quantity: Number(quantity),
        shipping_payer_type: shippingPayerType,
        shipping_origin_area: prefectureId,
        shipping_days_id: shippingDaysId,
        shipping_method_id: shippingMethodId,
        item_condition: itemCondition,
      };

      await updateItem(currentItemId, payload);
      router.push("/my/stocks"); // 荳隕ｧ縺ｸ驕ｷ遘ｻ
    } catch (err) {
      console.error(err);
      setError("出品に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  if (draftLoading) {
    return <div className="p-8 text-center">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div>;
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">商品の出品</h1>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 逕ｻ蜒上い繝・・ｽE繝ｭ繝ｼ繝・UI */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            蝠・・ｽ・ｽ逕ｻ蜒・(蠢・・ｽ・ｽE
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
              繝峨Λ繝・・ｽ・ｽ・ｽE・ｽE・ｽ・ｽ繝ｭ繝・・ｽE 縺ｾ縺滂ｿｽE 繧ｯ繝ｪ繝・・ｽ・ｽ縺励※逕ｻ蜒上ｒ繧｢繝・・ｽE繝ｭ繝ｼ繝・
            </p>
          </div>

          {/* 繝励Ξ繝薙Η繝ｼ繧ｰ繝ｪ繝・・ｽ・ｽ */}
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
                      ﾃ・
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
            {files.length}譫夲ｿｽE逕ｻ蜒・(繧｢繝・・ｽE繝ｭ繝ｼ繝画ｸ医∩:{" "}
            {files.filter((f) => f.status === "completed").length})
          </div>
        </div>

        {/* 蝠・・ｽ・ｽ隧ｳ邏ｰ */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            蝠・・ｽ・ｽ蜷・(蠢・・ｽ・ｽE
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
            蝠・・ｽ・ｽ縺ｮ隱ｬ譏・(蠢・・ｽ・ｽE
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* 繧ｫ繝・・ｽ・ｽ繝ｪ */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            繧ｫ繝・・ｽ・ｽ繝ｪ繝ｼ (蠢・・ｽ・ｽE
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            <option value="" className="text-gray-900">
              驕ｸ謚槭＠縺ｦ縺上□縺輔＞
            </option>
            {categories?.map((cat) => (
              <option
                key={cat.category_id}
                value={cat.category_id}
                className="text-gray-900"
              >
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* 蝠・・ｽ・ｽ縺ｮ迥ｶ諷・*/}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            蝠・・ｽ・ｽ縺ｮ迥ｶ諷・
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={itemCondition}
            onChange={(e) => setItemCondition(Number(e.target.value))}
          >
            <option value="0" className="text-gray-900">
              譁ｰ蜩√∵悴菴ｿ逕ｨ
            </option>
            <option value="1" className="text-gray-900">
              譛ｪ菴ｿ逕ｨ縺ｫ霑代＞
            </option>
            <option value="2" className="text-gray-900">
              逶ｮ遶九▲縺溷す繧・・ｽ・ｽ繧後↑縺・
            </option>
          </select>
        </div>

        {/* 驟埼√↓縺､縺・・ｽ・ｽ */}
        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            驟埼√↓縺､縺・・ｽ・ｽ
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                驟埼∵侭縺ｮ雋諡・
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm"
                value={shippingPayerType}
                onChange={(e) => setShippingPayerType(Number(e.target.value))}
              >
                <option value="0" className="text-gray-900">
                  騾∵侭霎ｼ縺ｿ (蜃ｺ蜩∬・・ｽ・ｽ諡・
                </option>
                <option value="1" className="text-gray-900">
                  逹謇輔＞ (雉ｼ蜈･閠・・ｽ・ｽ諡・
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                逋ｺ騾・ｿｽE縺ｮ蝨ｰ蝓・
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
                逋ｺ騾√∪縺ｧ縺ｮ譌･謨ｰ
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
                驟埼∵婿豕・
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

        {/* 萓｡譬ｼ繝ｻ蝨ｨ蠎ｫ */}
        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">萓｡譬ｼ縺ｨ蝨ｨ蠎ｫ</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                雋ｩ螢ｲ萓｡譬ｼ (蠢・・ｽ・ｽE
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">ﾂ･</span>
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
                蝨ｨ蠎ｫ謨ｰ
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

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || pendingCount > 0}
            className={`flex w-full justify-center rounded-md border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm ${
              loading || pendingCount > 0
                ? "bg-gray-400"
                : "bg-red-600 hover:bg-red-700"
            } focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none`}
          >
            {loading
              ? "蜃ｦ逅・・ｽ・ｽ..."
              : pendingCount > 0
                ? `逕ｻ蜒上い繝・・ｽE繝ｭ繝ｼ繝我ｸｭ (${pendingCount})`
                : "出品する"}
          </button>
        </div>
      </form>
    </div>
  );
}
