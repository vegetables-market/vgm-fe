/**
 * モックデータ
 * TODO: 実際のAPIが実装されたら削除してください
 */

import { ShippingAddress, PaymentMethod, DeliveryPlaceOption } from '@/lib/types';

export const MOCK_ADDRESSES: ShippingAddress[] = [
  {
    id: '1',
    name: '山田 太郎',
    nameKana: 'ヤマダ タロウ',
    postalCode: '100-0001',
    prefecture: '東京都',
    city: '千代田区',
    address1: '千代田1-1-1',
    address2: 'マンション101',
    phone: '090-1234-5678',
    isDefault: true,
  },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit_card',
    label: 'クレジットカード',
    cardLastFour: '1234',
  },
];

export const DEFAULT_DELIVERY_PLACE: DeliveryPlaceOption = 'door';
