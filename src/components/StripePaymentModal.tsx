'use client';

import { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import PaymentForm from './PaymentForm';

interface StripePaymentModalProps {
  isOpen: boolean;
  clientSecret: string;
  amount: number;
  productName: string;
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
}

export default function StripePaymentModal({
  isOpen,
  clientSecret,
  amount,
  productName,
  onClose,
  onPaymentSuccess,
}: StripePaymentModalProps) {
  // Escキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // モーダル表示中はスクロール無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleError = (error: string) => {
    console.error('決済エラー:', error);
    // エラーはPaymentForm内で表示されるため、ここでは何もしない
  };

  const stripePromise = getStripe();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="border-b border-gray-200 p-6">
          <h2 id="payment-modal-title" className="text-2xl font-bold text-gray-800">
            決済情報の入力
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 商品情報 */}
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">商品名</span>
              <span className="font-medium text-gray-800">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">支払い金額</span>
              <span className="text-2xl font-bold text-blue-600">
                ¥{amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 決済フォーム */}
        <div className="p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#2563eb',
                },
              },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              amount={amount}
              onSuccess={onPaymentSuccess}
              onError={handleError}
              onCancel={onClose}
            />
          </Elements>
        </div>

        {/* フッター（注意事項） */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            このサイトはStripeによって保護されており、カード情報は安全に処理されます。
          </p>
        </div>
      </div>
    </div>
  );
}
