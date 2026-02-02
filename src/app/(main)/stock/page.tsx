'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyItems, deleteItem, updateItemStatus } from '@/lib/api';

interface Item {
  id: number;
  name: string;
  price: number;
  status: number;
  imageUrl: string | null;
  created_at: string;
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
        setItems(data);
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
      loadItems(); // 一覧を再読み込み
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (itemId: number, currentStatus: number) => {
    // status 2 (出品中) ⇔ status 5 (停止中) の切り替え
    const newStatus = currentStatus === 2 ? 5 : 2;
    const statusText = newStatus === 2 ? '出品中' : '停止中';
    
    if (!confirm(`ステータスを「${statusText}」に変更しますか？`)) {
      return;
    }

    setUpdatingStatus(itemId);
    try {
      await updateItemStatus(itemId, newStatus);
      loadItems(); // 一覧を再読み込み
    } catch (err) {
      console.error(err);
      alert('ステータスの更新に失敗しました');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 2: return <span className="text-green-600 font-bold">出品中</span>;
      case 3: return <span className="text-blue-600 font-bold">取引中</span>;
      case 4: return <span className="text-gray-600 font-bold">売却済</span>;
      case 5: return <span className="text-red-600 font-bold">停止中</span>;
      default: return <span>不明</span>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };

  // 商品画像のURLを構築
  const getImageUrl = (filename: string | null) => {
    if (!filename) return '/images/no-image.png'; // プレースホルダー
    // filenameが既に http... で始まる場合はそのまま、それ以外はNEXT_PUBLIC_MEDIA_URLを付与
    if (filename.startsWith('http')) return filename;
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8787'; 
    // 末尾のスラッシュ調整
    const baseUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${filename}`;
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">出品・在庫管理</h1>
        <Link 
          href="/stock/new" 
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
        >
          新規出品
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded shadow text-gray-500">
          出品している商品はありません。
          <br />
          <Link href="/stock/new" className="text-blue-600 hover:underline mt-2 inline-block">
            最初の商品を出品する
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  価格
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出品日時
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-14 w-14">
                        <img 
                          className="h-14 w-14 rounded object-cover border" 
                          src={getImageUrl(item.imageUrl)} 
                          alt={item.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatPrice(item.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end items-center">
                      {/* ステータス切り替えボタン（出品中⇔停止中のみ） */}
                      {(item.status === 2 || item.status === 5) && (
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          disabled={updatingStatus === item.id}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                        >
                          {updatingStatus === item.id ? '更新中...' : item.status === 2 ? '停止' : '再開'}
                        </button>
                      )}
                      <Link href={`/stock/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deleting === item.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === item.id ? '削除中...' : '削除'}
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