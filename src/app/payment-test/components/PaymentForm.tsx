'use client';

import { useState, FormEvent } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

/**
 * エラーメッセージの日本語変換
 */
const ERROR_MESSAGES: Record<string, string> = {
  card_declined: 'カードが拒否されました。別のカードをお試しください。',
  insufficient_funds: '残高不足です。',
  invalid_card_number: 'カード番号が正しくありません。',
  invalid_expiry_year: '有効期限の年が正しくありません。',
  invalid_expiry_month: '有効期限の月が正しくありません。',
  invalid_cvc: 'セキュリティコード(CVC)が正しくありません。',
  expired_card: 'カードの有効期限が切れています。',
  incorrect_cvc: 'セキュリティコード(CVC)が正しくありません。',
  processing_error: '処理中にエラーが発生しました。もう一度お試しください。',
  generic: '決済処理に失敗しました。もう一度お試しください。',
};

/**
 * Stripe エラーコードを日本語メッセージに変換
 */
const getErrorMessage = (code?: string): string => {
  if (!code) return ERROR_MESSAGES.generic;
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.generic;
};

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export default function PaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripeの初期化が完了していません。ページを再読み込みしてください。');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('カード入力フィールドが見つかりません。');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Stripe決済を実行
      console.log('決済開始 - Client Secret:', clientSecret);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      console.log('Stripe レスポンス:', { error, paymentIntent });

      if (error) {
        // 決済エラー
        console.error('Stripe決済エラー詳細:', error);
        const message = getErrorMessage(error.code);
        setErrorMessage(`${message}\n\n詳細: ${error.message || '不明なエラー'}`);
        onError(message);
      } else if (
        paymentIntent &&
        (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture')
      ) {
        // 決済成功
        // succeeded: 即座に確定
        // requires_capture: 手動キャプチャモード（エスクロー）でカード認証完了
        console.log('決済成功! Payment Intent ID:', paymentIntent.id, 'ステータス:', paymentIntent.status);
        onSuccess(paymentIntent.id);
      } else {
        // 予期しない状態
        console.error('予期しない状態:', {
          paymentIntentExists: !!paymentIntent,
          status: paymentIntent?.status,
          fullPaymentIntent: paymentIntent
        });
        setErrorMessage(`決済処理が完了しませんでした。\n\nステータス: ${paymentIntent?.status || 'unknown'}\n\n詳細はコンソールを確認してください。`);
        onError('決済処理が完了しませんでした。');
      }
    } catch (err: any) {
      console.error('予期しない例外:', err);
      const message = err.message || '予期しないエラーが発生しました。';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* カード入力フィールド */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カード情報
        </label>
        <div className="border rounded-lg p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          テストカード: 4242 4242 4242 4242
        </p>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* ボタン */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? '処理中...' : `¥${amount.toLocaleString()}を支払う`}
        </button>
      </div>
    </form>
  );
}
