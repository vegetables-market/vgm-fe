'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProducts,
  createProduct,
  createOrder,
  createPayment,
  releaseEscrow,
  confirmPayment,
  Product,
  CreateProductRequest,
} from '@/lib/api';
import StripePaymentModal from './components/StripePaymentModal';

export default function PaymentTestPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ userId: number; username: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'create' | 'test'>('products');

  // Stripe決済モーダル用の状態
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentClientSecret, setCurrentClientSecret] = useState<string | null>(null);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [currentProductName, setCurrentProductName] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

  // 新規商品作成フォーム
  const [newProduct, setNewProduct] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    sellerId: 0,
    category: '',
    stock: 1,
  });

  // テスト決済フォーム
  const [testOrder, setTestOrder] = useState({
    productId: 0,
    orderId: 0,
    paymentMethod: 'CREDIT_CARD' as 'CREDIT_CARD' | 'PAYPAY',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser({ userId: parsedUser.id, username: parsedUser.username });
    setNewProduct((prev) => ({ ...prev, sellerId: parsedUser.id }));

    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.products);
    } catch (error) {
      console.error('商品一覧の取得に失敗:', error);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await createProduct(newProduct);
      if (response.success) {
        setMessage(`✅ ${response.message}`);
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          sellerId: user?.userId || 0,
          category: '',
          stock: 1,
        });
        loadProducts();
      } else {
        setMessage(`❌ ${response.message}`);
      }
    } catch (error: any) {
      setMessage(`❌ エラー: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPurchase = async (productId: number) => {
    if (!user) return;

    setLoading(true);
    setMessage('');

    try {
      // 1. 注文作成
      const orderResponse = await createOrder({
        buyerId: user.userId,
        productId: productId,
        shippingAddress: '東京都渋谷区テスト1-2-3',
        shippingPostalCode: '150-0001',
        shippingRecipientName: user.username,
        shippingPhoneNumber: '090-1234-5678',
      });

      if (!orderResponse.success || !orderResponse.orderId) {
        setMessage(`❌ 注文作成失敗: ${orderResponse.message}`);
        return;
      }

      setMessage(`✅ 注文作成成功 (注文ID: ${orderResponse.orderId})`);
      setTestOrder((prev) => ({ ...prev, orderId: orderResponse.orderId! }));

      // 2. 決済開始
      const paymentResponse = await createPayment({
        orderId: orderResponse.orderId,
        userId: user.userId,
        paymentMethod: testOrder.paymentMethod,
        amount: orderResponse.totalAmount || 0,
      });

      if (!paymentResponse.success) {
        setMessage((prev) => `${prev}\n❌ 決済開始失敗: ${paymentResponse.message}`);
        return;
      }

      if (testOrder.paymentMethod === 'CREDIT_CARD') {
        // Client Secret取得成功 → モーダル表示
        const product = products.find(p => p.id === productId);
        setCurrentClientSecret(paymentResponse.clientSecret!);
        setCurrentAmount(orderResponse.totalAmount || 0);
        setCurrentProductName(product?.name || '商品');
        setCurrentOrderId(orderResponse.orderId!);
        setShowPaymentModal(true);
        setMessage(
          (prev) =>
            `${prev}\n✅ 決済準備完了\n` +
            `モーダルでカード情報を入力してください。`
        );
      } else {
        setMessage(
          (prev) =>
            `${prev}\n✅ PayPay決済開始成功\n` +
            `PayPay URL: ${paymentResponse.paypayUrl}`
        );
      }
    } catch (error: any) {
      setMessage(`❌ エラー: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setLoading(true);

      // バックエンドに決済確認リクエスト送信
      const confirmResponse = await confirmPayment({ paymentIntentId });

      if (confirmResponse.success) {
        setMessage((prev) => `${prev}\n✅ ${confirmResponse.message}`);
        setShowPaymentModal(false);

        // 商品リストを再読み込み（ステータス更新を反映）
        await loadProducts();

        // 注文IDをメッセージに追加
        if (currentOrderId) {
          setMessage(
            (prev) =>
              `${prev}\n📝 注文ID: ${currentOrderId}\n` +
              `「決済テスト」タブでエスクロー解除をテストできます。`
          );
        }
      } else {
        setMessage((prev) => `${prev}\n❌ 確認失敗: ${confirmResponse.message}`);
        setShowPaymentModal(false);
      }
    } catch (error: any) {
      setMessage((prev) => `${prev}\n❌ エラー: ${error.message}`);
      setShowPaymentModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseEscrow = async () => {
    if (!testOrder.orderId) {
      setMessage('❌ 注文IDを入力してください');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await releaseEscrow({ orderId: testOrder.orderId });
      if (response.success) {
        setMessage(`✅ ${response.message}`);
      } else {
        setMessage(`❌ ${response.message}`);
      }
    } catch (error: any) {
      setMessage(`❌ エラー: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">決済機能テストページ</h1>
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              プロフィールに戻る
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            ログイン中: <span className="font-semibold">{user.username}</span> (ID: {user.userId})
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'products'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              商品一覧
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'create'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              商品作成
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'test'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              決済テスト
            </button>
          </div>
        </div>

        {/* メッセージ表示 */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{message}</pre>
          </div>
        )}

        {/* 商品一覧タブ */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">販売中の商品</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <p className="text-gray-600 col-span-full text-center py-8">
                  商品がありません。「商品作成」タブから商品を追加してください。
                </p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-4">¥{product.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      出品者: {product.sellerName} | {product.category}
                    </p>
                    <button
                      onClick={() => handleTestPurchase(product.id)}
                      disabled={loading || product.sellerId === user.userId}
                      className={`w-full mt-4 py-2 rounded-lg font-semibold ${
                        product.sellerId === user.userId
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {product.sellerId === user.userId ? '自分の商品' : '購入テスト'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 商品作成タブ */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">新規商品作成</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品名</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">価格（円）</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 家電"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? '作成中...' : '商品を作成'}
              </button>
            </form>
          </div>
        )}

        {/* 決済テストタブ */}
        {activeTab === 'test' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">決済フローテスト</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg">ステップ1: 商品を購入する</h3>
                <p className="text-sm text-gray-600 mt-1">
                  「商品一覧」タブから商品の「購入テスト」ボタンをクリックしてください。
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-lg">ステップ2: エスクロー解除（入金）</h3>
                <p className="text-sm text-gray-600 mt-1">
                  商品受取確認後、出品者に入金します。
                </p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">注文ID</label>
                    <input
                      type="number"
                      value={testOrder.orderId || ''}
                      onChange={(e) => setTestOrder({ ...testOrder, orderId: Number(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="購入後に表示される注文IDを入力"
                    />
                  </div>
                  <button
                    onClick={handleReleaseEscrow}
                    disabled={loading || !testOrder.orderId}
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? '処理中...' : 'エスクロー解除（出品者へ入金）'}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800">注意事項</h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                  <li>実際の決済にはStripe APIキーの設定が必要です</li>
                  <li>PayPay決済は法人契約が必要です</li>
                  <li>このページはテスト環境用です</li>
                  <li>プラットフォーム手数料は10%に設定されています</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stripe決済モーダル */}
      {showPaymentModal && currentClientSecret && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          clientSecret={currentClientSecret}
          amount={currentAmount}
          productName={currentProductName}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
