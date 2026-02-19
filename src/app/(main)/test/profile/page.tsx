"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// ★修正: Headerをインポート
import Header from "@/components/dist/Header";
import Footer from "@/components/dist/Footer";

// ==========================================
// 1. 編集用モーダルコンポーネント
// ==========================================
function EditProfileModal({ user, onClose, onSave }: any) {
  // アバター変更用のプレビューState
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    zipCode: "441-3400",
    prefecture: "愛知県",
    city: "田原市",
    addressLine: "野田町1-2-3",
    building: "ファームハウスA",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 画像が選択された時の処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ローカルでプレビューURLを作成
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({
      ...user,
      name: formData.name,
      bio: formData.bio,
      location: `${formData.prefecture} ${formData.city}`,
      avatar: avatarPreview, // 変更後の画像URLを保存
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ★重要: data-lenis-prevent を追加
         これでLenisのスクロールジャックを防ぎ、マウスホイールでスクロールできるようになる
      */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-stone-800">プロフィール編集</h2>
          <button
            onClick={onClose}
            className="p-2 font-bold text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* ★重要: data-lenis-prevent をここにも念のため追加し、overflow-y-autoを設定
         */}
        <div className="space-y-6 overflow-y-auto p-6" data-lenis-prevent>
          <form onSubmit={handleSubmit}>
            {/* 画像アップロードエリア */}
            <div className="mb-6 flex flex-col items-center">
              <div
                className="group relative cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-stone-100 transition group-hover:border-green-500">
                  <Image
                    src={avatarPreview}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* オーバーレイアイコン */}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition group-hover:opacity-100">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-400">
                クリックして写真を変更
              </p>
              {/* 隠しinput */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* 名前 */}
            <div className="mb-6">
              <label className="mb-1 block text-xs font-bold text-stone-500">
                生産者名 / 表示名
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* 住所エリア */}
            <div className="mb-6 space-y-4 rounded-xl border border-stone-100 bg-stone-50 p-4">
              <p className="flex items-center gap-1 text-xs font-bold text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                発送元・活動拠点
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="mb-1 block text-[10px] text-stone-400">
                    郵便番号
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full rounded border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-[10px] text-stone-400">
                    都道府県
                  </label>
                  <select
                    name="prefecture"
                    value={formData.prefecture}
                    onChange={handleChange}
                    className="w-full appearance-none rounded border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                  >
                    <option>愛知県</option>
                    <option>東京都</option>
                    <option>北海道</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] text-stone-400">
                    市区町村
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-stone-400">
                    番地
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    className="w-full rounded border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-stone-400">
                  建物名・部屋番号
                </label>
                <input
                  type="text"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  className="w-full rounded border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* 自己紹介 */}
            <div className="mb-8">
              <label className="mb-1 block text-xs font-bold text-stone-500">
                自己紹介 (Bio)
              </label>
              <textarea
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 border-t border-stone-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full bg-gray-100 py-3 font-bold text-stone-500 transition hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 transform rounded-full bg-green-600 py-3 font-bold text-white shadow-lg transition hover:bg-green-700 active:scale-95"
              >
                保存する
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// 2. メインページコンポーネント
// ==========================================
export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [user, setUser] = useState({
    name: "山田 太郎",
    accountType: "Producer",
    location: "愛知県 田原市",
    email: "yamada.farm@example.com",
    avatar: "images/bg1.webp",
    bio: "渥美半島でキャベツとトマトを育てています。農薬を減らして、甘くて味の濃い野菜作りを目指しています。発送は翌日を心がけています！",
    stats: { listings: 24, deals: 156, rating: 4.8 },
  });

  const listings = [
    {
      id: 1,
      name: "朝採れ完熟トマト 2kg",
      price: 1200,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
      status: "販売中",
    },
    {
      id: 2,
      name: "訳あり新玉ねぎ 5kg",
      price: 1500,
      image:
        "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&w=400&q=80",
      status: "売切れ",
    },
    {
      id: 3,
      name: "採れたて春キャベツ 3玉",
      price: 980,
      image:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80",
      status: "販売中",
    },
  ];

  useEffect(() => {
    // if (!sessionStorage.getItem('harvest_is_logged_in')) {
    //   router.push('/login');
    // } else {
    setIsLoading(false);
    // }
  }, [router]);

  const handleSaveProfile = (updatedUser: any) => {
    setUser(updatedUser);
    setIsEditModalOpen(false);
  };

  if (isLoading) return <div className="min-h-screen bg-[#f9f8f4]" />;

  return (
    <div className="min-h-screen bg-[#f9f8f4] text-stone-700">
      {/* ★修正: Headerコンポーネントを使用 */}
      <Header />

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>

      <main className="mx-auto mt-6 mb-20 max-w-[900px] p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm"
        >
          <div className="relative h-40 bg-stone-200">
            <Image
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
              alt="Cover"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="px-6 pb-8">
            <div className="relative mb-6 flex flex-col items-start sm:flex-row">
              <div className="relative z-10 -mt-12 mr-5 mb-4 sm:mb-0">
                <div className="inline-block rounded-full bg-white p-1">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={100}
                    height={100}
                    className="h-[100px] w-[100px] rounded-full object-cover shadow-md"
                  />
                </div>
              </div>

              <div className="mt-4 w-full flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-stone-800">
                      {user.name}
                      <span className="rounded border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        生産者
                      </span>
                    </h1>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium text-stone-500">
                      <svg
                        className="h-4 w-4 text-stone-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      {user.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 rounded-full bg-stone-800 px-6 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-black"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                    編集
                  </button>
                </div>
              </div>
            </div>

            <p className="mb-8 rounded-xl border border-stone-100 bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
              {user.bio}
            </p>

            {/* スタッツ */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm">
                <span className="block text-2xl font-bold text-stone-800">
                  {user.stats.listings}
                </span>
                <span className="text-xs font-bold text-stone-400">出品数</span>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm">
                <span className="block text-2xl font-bold text-stone-800">
                  {user.stats.deals}
                </span>
                <span className="text-xs font-bold text-stone-400">
                  取引完了
                </span>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm">
                <span className="block flex items-center justify-center gap-1 text-2xl font-bold text-stone-800">
                  {user.stats.rating}
                  <svg
                    className="h-4 w-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </span>
                <span className="text-xs font-bold text-stone-400">評価</span>
              </div>
            </div>

            {/* 出品リスト */}
            <div>
              <div className="mb-6 flex border-b border-stone-200">
                <button className="border-b-2 border-green-800 px-4 py-2 text-sm font-bold text-green-800">
                  出品した商品
                </button>
                <button className="px-4 py-2 text-sm font-bold text-stone-400 hover:text-stone-600">
                  購入履歴
                </button>
                <button className="px-4 py-2 text-sm font-bold text-stone-400 hover:text-stone-600">
                  いいね
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {listings.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-xl bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      {item.status === "売切れ" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
                          SOLD OUT
                        </div>
                      )}
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-bold text-stone-800">
                      {item.name}
                    </h3>
                    <p className="font-bold text-green-700">
                      ¥{item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
