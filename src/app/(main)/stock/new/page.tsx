'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, updateItem } from '@/lib/api';
import { useItemDraft } from '@/hooks/useItemDraft';
import { useMultiImageUpload } from '@/hooks/useMultiImageUpload';

export default function StockNewPage() {
  const router = useRouter();
  const { itemId, initDraft, loading: draftLoading } = useItemDraft();
  const { files, addFiles, removeFile, isAllCompleted, hasError, pendingCount } = useMultiImageUpload(itemId, { initDraft });
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

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

  // Fetch categories on mount (draft is created when first image is added)
  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  // Drag & Drop Handlers
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, [addFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    // file inputクリア
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!itemId) {
        setError('Draft Item initialization failed. Please reload.');
        return;
    }

    if (files.length === 0) {
      setError('画像アップロードは必須です。');
      return;
    }
    
    if (pendingCount > 0) {
         setError('画像のアップロード中です。完了までお待ちください。');
         return;
    }
    
    if (hasError) {
        setError('画像のアップロードに失敗しているものがあります。削除してやり直してください。');
        return;
    }

    // 既に完了していなければチェック
    if (!isAllCompleted) {
        setError('画像のアップロードが完了していません。');
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
      };

      await updateItem(itemId, payload);
      router.push('/stock'); // 一覧へ遷移
    } catch (err) {
      console.error(err);
      setError('出品に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  if (draftLoading) {
      return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">商品の出品</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 画像アップロード UI */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">商品画像 (必須)</label>
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
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
                ドラッグ＆ドロップ または クリックして画像をアップロード
             </p>
          </div>

          {/* プレビューグリッド */}
          {files.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                  {files.map((file) => (
                      <div key={file.id} className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={file.previewUrl} 
                            alt="preview" 
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Overlay for status */}
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                type="button"
                                onClick={() => removeFile(file.id)}
                                className="bg-red-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-red-600"
                              >
                                  ×
                              </button>
                          </div>
                          
                          {/* Status Indicator */}
                          {file.status !== 'completed' && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                  <div 
                                    className={`h-full ${file.status === 'error' ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${file.progress}%` }}
                                  />
                              </div>
                          )}
                          
                          {file.status === 'error' && (
                              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1">Error</div>
                          )}
                      </div>
                  ))}
              </div>
          )}
          
          <div className="mt-2 text-sm text-gray-500 text-right">
             {files.length}枚の画像 (アップロード済み: {files.filter(f => f.status === 'completed').length})
          </div>
        </div>

        {/* 商品詳細 */}
        <div>
          <label className="block text-sm font-medium text-gray-900">商品名 (必須)</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">商品の説明 (必須)</label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm font-medium text-gray-900">カテゴリー (必須)</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            <option value="" className="text-gray-900">選択してください</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId} className="text-gray-900">{cat.name}</option>
            ))}
          </select>
        </div>

        {/* 商品の状態 */}
        <div>
          <label className="block text-sm font-medium text-gray-900">商品の状態</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            value={itemCondition}
            onChange={(e) => setItemCondition(Number(e.target.value))}
          >
            <option value="0" className="text-gray-900">新品、未使用</option>
            <option value="1" className="text-gray-900">未使用に近い</option>
            <option value="2" className="text-gray-900">目立った傷や汚れなし</option>
          </select>
        </div>

        {/* 配送について */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">配送について</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">配送料の負担</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white"
                value={shippingPayerType}
                onChange={(e) => setShippingPayerType(Number(e.target.value))}
              >
                <option value="0" className="text-gray-900">送料込み (出品者負担)</option>
                <option value="1" className="text-gray-900">着払い (購入者負担)</option>
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-900">発送元の地域</label>
               <select
                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white"
                 value={prefectureId}
                 onChange={(e) => setPrefectureId(Number(e.target.value))}
               >
                 {prefectureOptions.map(p => <option key={p.id} value={p.id} className="text-gray-900">{p.name}</option>)}
               </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">発送までの日数</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white"
                value={shippingDaysId}
                onChange={(e) => setShippingDaysId(Number(e.target.value))}
              >
                {shippingDaysOptions.map(opt => <option key={opt.id} value={opt.id} className="text-gray-900">{opt.name}</option>)}
              </select>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-900">配送方法</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white"
                value={shippingMethodId}
                onChange={(e) => setShippingMethodId(Number(e.target.value))}
              >
                {shippingMethodOptions.map(opt => <option key={opt.id} value={opt.id} className="text-gray-900">{opt.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 価格・在庫 */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">価格と在庫</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">販売価格 (必須)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">¥</span>
                </div>
                <input
                  type="number"
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 p-2 sm:text-sm border border-gray-300 rounded-md text-gray-900 bg-white"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">在庫数</label>
              <input
                type="number"
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full p-2 sm:text-sm border border-gray-300 rounded-md text-gray-900 bg-white"
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
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              (loading || pendingCount > 0) ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            {loading ? '処理中...' : pendingCount > 0 ? `画像アップロード中 (${pendingCount})` : '出品する'}
          </button>
        </div>
      </form>
    </div>
  );
}