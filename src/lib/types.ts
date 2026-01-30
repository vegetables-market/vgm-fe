// 配送先住所
export interface ShippingAddress {
  id: string;
  name: string; // 氏名
  nameKana: string; // フリガナ
  postalCode: string; // 郵便番号
  prefecture: string; // 都道府県
  city: string; // 市区町村
  address1: string; // 町名・番地
  address2?: string; // 建物名・部屋番号
  phone: string; // 電話番号
  isDefault: boolean; // デフォルト住所
}

// 支払い方法の種類
export type PaymentMethodType =
  | "credit_card"
  | "convenience_store"
  | "carrier_docomo"
  | "carrier_au"
  | "carrier_softbank"
  | "bank";

// 支払い方法
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string; // 表示名
  sublabel?: string; // 手数料等の補足
  cardBrand?: "visa" | "mastercard" | "amex" | "jcb";
  cardLastFour?: string; // 下4桁
  cardExpiry?: string; // 有効期限
  fee?: string; // 手数料
}

// 置き配オプション
export type DeliveryPlaceOption =
  | "door" // 玄関前
  | "delivery_box" // 宅配ボックス
  | "gas_meter" // ガスメーターボックス
  | "bicycle" // 自転車かご
  | "garage" // 車庫
  | "building_door" // 建物内受付/管理人
  | "hand_delivery"; // 対面受取（置き配しない）

// 置き配オプションのラベル
export const DELIVERY_PLACE_LABELS: Record<DeliveryPlaceOption, string> = {
  door: "玄関前",
  delivery_box: "宅配ボックス",
  gas_meter: "ガスメーターボックス",
  bicycle: "自転車のかご",
  garage: "車庫",
  building_door: "建物内受付/管理人預け",
  hand_delivery: "対面で受け取る（置き配しない）",
};
