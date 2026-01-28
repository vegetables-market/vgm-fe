import { ShippingAddress, PaymentMethod, DeliveryPlaceOption } from "./types";

// モック配送先住所（架空のデータ）
export const MOCK_ADDRESSES: ShippingAddress[] = [
  {
    id: "addr_1",
    name: "山田 太郎",
    nameKana: "ヤマダ タロウ",
    postalCode: "150-0001",
    prefecture: "東京都",
    city: "渋谷区",
    address1: "神宮前1-2-3",
    address2: "サンプルマンション 101号室",
    phone: "090-0000-0000",
    isDefault: true,
  },
  {
    id: "addr_2",
    name: "山田 太郎",
    nameKana: "ヤマダ タロウ",
    postalCode: "530-0001",
    prefecture: "大阪府",
    city: "大阪市北区",
    address1: "梅田4-5-6",
    address2: "グランドタワー 2020号室",
    phone: "090-0000-0000",
    isDefault: false,
  },
];

// モック支払い方法（架空のデータ）
export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "credit_card",
    label: "クレジットカード決済",
    cardBrand: "visa",
    cardLastFour: "4242",
    cardExpiry: "12/28",
    fee: "手数料 ¥0",
  },
  {
    id: "pm_2",
    type: "credit_card",
    label: "クレジットカード決済",
    cardBrand: "mastercard",
    cardLastFour: "8888",
    cardExpiry: "06/29",
    fee: "手数料 ¥0",
  },
  {
    id: "pm_carrier_docomo",
    type: "carrier_docomo",
    label: "d払い（ドコモ）",
    sublabel: "手数料 ¥100～¥300",
  },
  {
    id: "pm_carrier_au",
    type: "carrier_au",
    label: "au / UQ mobile",
    sublabel: "手数料 ¥100～¥300",
  },
  {
    id: "pm_carrier_softbank",
    type: "carrier_softbank",
    label: "ソフトバンクまとめて支払い",
    sublabel: "手数料 ¥100～¥300",
  },
  {
    id: "pm_convenience",
    type: "convenience_store",
    label: "コンビニ / ATM払い",
    sublabel: "手数料 ¥100～¥300",
  },
];

// デフォルトの置き配設定
export const DEFAULT_DELIVERY_PLACE: DeliveryPlaceOption = "door";
