'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { createItem, getCategories } from '@/lib/api';

export default function StockNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [imageFilename, setImageFilename] = useState('');

  // Constants (Mock Masters for now)
  const shippingDaysOptions = [
    { id: 1, name: '1~2日で発送' },
    { id: 2, name: '2~3日で発送' },
    { id: 3, name: '4~7日で発送' },
  ];
  const shippingMethodOptions = [
    { id: 1, name: '未定' },
    { id: 2, name: 'らくらくメルカリ便' },
  ];
  const prefectureOptions = [
    { id: 13, name: '東京都' },
    { id: 27, name: '大阪府' },
  ];

  const [shippingDaysId, setShippingDaysId] = useState(1);
  const [shippingMethodId, setShippingMethodId] = useState(1);
  const [prefectureId, setPrefectureId] = useState(13);
  const [shippingPayerType, setShippingPayerType] = useState(0); // 0:送料込
  const [itemCondition, setItemCondition] = useState(0); // 0:新品

  useEffect(() => {
    // Fetch categories
    getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  const handleUploadComplete = (filename: string) => {
    setImageFilename(filename);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imageFilename) {
      setError('画像アップロードは必須です。');
      return;
    }
    if (!name || !description || !price || !categoryId) {
      setError('必須項目を入力してください。');
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
        image_urls: [imageFilename] // 1枚のみ対応
      };

      await createItem(payload);
      router.push('/stock'); // 一覧へ遷移
    } catch (err) {
      console.error(err);
      setError('出品に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">商品の出品</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 画像アップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">商品画像 (必須)</label>
          <ImageUploader onUploadCompleteAction={handleUploadComplete} />
          {imageFilename && <p className="text-sm text-green-600 mt-1">✓ アップロード済み: {imageFilename}</p>}
        </div>

        {/* 商品詳細 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">商品名 (必須)</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">商品の説明 (必須)</label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">カテゴリー (必須)</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            <option value="">選択してください</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* 商品の状態 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">商品の状態</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
            value={itemCondition}
            onChange={(e) => setItemCondition(Number(e.target.value))}
          >
            <option value="0">新品、未使用</option>
            <option value="1">未使用に近い</option>
            <option value="2">目立った傷や汚れなし</option>
          </select>
        </div>

        {/* 配送について */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">配送について</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">配送料の負担</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                value={shippingPayerType}
                onChange={(e) => setShippingPayerType(Number(e.target.value))}
              >
                <option value="0">送料込み (出品者負担)</option>
                <option value="1">着払い (購入者負担)</option>
              </select>
            </div>
            
            <div>
               <label className="block text-sm font-medium text-gray-700">発送元の地域</label>
               <select 
                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                 value={prefectureId}
                 onChange={(e) => setPrefectureId(Number(e.target.value))}
               >
                 {prefectureOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
               </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">発送までの日数</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                value={shippingDaysId}
                onChange={(e) => setShippingDaysId(Number(e.target.value))}
              >
                {shippingDaysOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700">配送方法</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                value={shippingMethodId}
                onChange={(e) => setShippingMethodId(Number(e.target.value))}
              >
                {shippingMethodOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 価格・在庫 */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">価格と在庫</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">販売価格 (必須)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">¥</span>
                </div>
                <input
                  type="number"
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 p-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">在庫数</label>
              <input
                type="number"
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full p-2 sm:text-sm border-gray-300 rounded-md"
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
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            {loading ? '出品中...' : '出品する'}
          </button>
        </div>
      </form>
    </div>
  );
}