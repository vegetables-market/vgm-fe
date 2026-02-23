"use client";

import { useState, useCallback } from "react";
import { ShippingAddress } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (address: ShippingAddress) => void;
}

// 郵便番号API（zipcloud）のレスポンス型
interface ZipCloudResponse {
  status: number;
  message: string | null;
  results:
    | {
        zipcode: string;
        prefcode: string;
        address1: string; // 都道府県
        address2: string; // 市区町村
        address3: string; // 町域
      }[]
    | null;
}

export function AddAddressModal({
  isOpen,
  onClose,
  onAdd,
}: AddAddressModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    nameKana: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address1: "",
    address2: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState<string | null>(
    null,
  );

  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];

  // 郵便番号から住所を検索
  const searchAddressByPostalCode = useCallback(async (postalCode: string) => {
    // 郵便番号のフォーマットチェック（ハイフンあり・なし両対応）
    const cleanedPostalCode = postalCode.replace("-", "");
    if (!/^\d{7}$/.test(cleanedPostalCode)) {
      return;
    }

    setIsSearchingAddress(true);
    setAddressSearchError(null);

    try {
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanedPostalCode}`,
      );
      const data: ZipCloudResponse = await response.json();

      if (data.status === 200 && data.results && data.results.length > 0) {
        const result = data.results[0];
        setFormData((prev) => ({
          ...prev,
          prefecture: result.address1,
          city: result.address2,
          address1: result.address3,
        }));
        // エラーをクリア
        setErrors((prev) => ({
          ...prev,
          prefecture: "",
          city: "",
          address1: "",
        }));
      } else {
        setAddressSearchError("該当する住所が見つかりませんでした");
      }
    } catch {
      setAddressSearchError("住所の検索に失敗しました");
    } finally {
      setIsSearchingAddress(false);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // 郵便番号の場合、7桁入力されたら自動検索
    if (name === "postalCode") {
      const cleanedValue = value.replace("-", "");
      if (cleanedValue.length === 7) {
        searchAddressByPostalCode(value);
      }
    }
  };

  // 住所検索ボタンのハンドラ
  const handleSearchAddress = () => {
    searchAddressByPostalCode(formData.postalCode);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "氏名を入力してください";
    if (!formData.nameKana.trim())
      newErrors.nameKana = "フリガナを入力してください";
    if (!formData.postalCode.match(/^\d{3}-?\d{4}$/))
      newErrors.postalCode = "正しい郵便番号を入力してください";
    if (!formData.prefecture)
      newErrors.prefecture = "都道府県を選択してください";
    if (!formData.city.trim()) newErrors.city = "市区町村を入力してください";
    if (!formData.address1.trim())
      newErrors.address1 = "町名・番地を入力してください";
    if (!formData.phone.match(/^[\d-]{10,14}$/))
      newErrors.phone = "正しい電話番号を入力してください";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const newAddress: ShippingAddress = {
      id: `addr_${Date.now()}`,
      name: formData.name,
      nameKana: formData.nameKana,
      postalCode: formData.postalCode
        .replace("-", "")
        .replace(/(\d{3})(\d{4})/, "$1-$2"),
      prefecture: formData.prefecture,
      city: formData.city,
      address1: formData.address1,
      address2: formData.address2 || undefined,
      phone: formData.phone,
      isDefault: false,
    };

    onAdd(newAddress);

    // フォームをリセット
    setFormData({
      name: "",
      nameKana: "",
      postalCode: "",
      prefecture: "",
      city: "",
      address1: "",
      address2: "",
      phone: "",
    });

    onClose();
  };

  const inputClass = (field: string) =>
    `w-full bg-gray-800 border ${errors[field] ? "border-red-500" : "border-gray-600"} rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
          />

          {/* モーダル本体 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-gray-900 md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
          >
            {/* ヘッダー */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-700 bg-gray-900 p-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-white">
                新しい配送先を追加
              </h2>
              <div className="w-10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              {/* 氏名 */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  氏名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  className={inputClass("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* フリガナ */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  フリガナ <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="nameKana"
                  value={formData.nameKana}
                  onChange={handleChange}
                  placeholder="ヤマダ タロウ"
                  className={inputClass("nameKana")}
                />
                {errors.nameKana && (
                  <p className="mt-1 text-xs text-red-400">{errors.nameKana}</p>
                )}
              </div>

              {/* 郵便番号 */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  郵便番号 <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="123-4567"
                    className={`${inputClass("postalCode")} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    disabled={isSearchingAddress}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                  >
                    {isSearchingAddress ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        検索中
                      </span>
                    ) : (
                      "住所を検索"
                    )}
                  </button>
                </div>
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.postalCode}
                  </p>
                )}
                {addressSearchError && (
                  <p className="mt-1 text-xs text-yellow-400">
                    {addressSearchError}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  ※ 郵便番号7桁入力で自動検索します
                </p>
              </div>

              {/* 都道府県 */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  都道府県 <span className="text-red-400">*</span>
                </label>
                <select
                  name="prefecture"
                  value={formData.prefecture}
                  onChange={handleChange}
                  className={`${inputClass("prefecture")} cursor-pointer appearance-none`}
                >
                  <option value="">選択してください</option>
                  {prefectures.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
                {errors.prefecture && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.prefecture}
                  </p>
                )}
              </div>

              {/* 市区町村 */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  市区町村 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="渋谷区"
                  className={inputClass("city")}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-400">{errors.city}</p>
                )}
              </div>

              {/* 町名・番地 */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  町名・番地 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  placeholder="神宮前1-2-3"
                  className={inputClass("address1")}
                />
                {errors.address1 && (
                  <p className="mt-1 text-xs text-red-400">{errors.address1}</p>
                )}
              </div>

              {/* 建物名・部屋番号 */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  建物名・部屋番号
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="サンプルマンション 101号室"
                  className={inputClass("address2")}
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  電話番号 <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="090-0000-0000"
                  className={inputClass("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-blue-600 py-4 font-bold text-white transition-colors hover:bg-blue-700"
              >
                配送先を追加する
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
