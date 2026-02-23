/**
 * Stripe インスタンス管理ユーティリティ
 *
 * Stripeインスタンスをシングルトンとして管理し、
 * 再レンダリングによる重複ロードを防ぐ
 */

import { loadStripe, Stripe } from "@stripe/stripe-js";

// Stripeインスタンスのキャッシュ
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Stripeインスタンスを取得する
 *
 * 初回呼び出し時にloadStripe()を実行し、
 * 2回目以降はキャッシュされたPromiseを返す
 *
 * @returns Stripeインスタンスまたはnull
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!key) {
      console.error(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYが設定されていません。\n" +
          "vgm-fe/.env.localファイルにStripe Publishable Keyを設定してください。",
      );
      return Promise.resolve(null);
    }

    if (!key.startsWith("pk_")) {
      console.error(
        "Stripe Publishable Keyの形式が正しくありません。\n" +
          'Publishable Keyは "pk_test_" または "pk_live_" で始まる必要があります。',
      );
      return Promise.resolve(null);
    }

    // Stripeインスタンスを非同期でロード
    stripePromise = loadStripe(key);
  }

  return stripePromise;
};
