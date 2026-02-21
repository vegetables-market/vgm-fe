import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/api/error-handler";
import type { CreateOrderInput } from "@/lib/market/orders/types/create-order-input";
import type { StockDetail } from "@/lib/market/stocks/types/stock-detail";
import { createOrder } from "@/service/market/orders/create-order";
import { payOrder } from "@/service/market/orders/pay-order";
import { getStockDetail } from "@/service/market/stocks/get-stock-detail";
import {
  DEFAULT_DELIVERY_PLACE,
  MOCK_ADDRESSES,
  MOCK_PAYMENT_METHODS,
} from "@/lib/mockData";
import type {
  DeliveryPlaceOption,
  PaymentMethod,
  ShippingAddress,
} from "@/lib/types";

type UsePurchasePageResult = {
  stock: StockDetail | null;
  isLoading: boolean;
  error: string;
  isPurchased: boolean;
  isProcessing: boolean;
  addresses: ShippingAddress[];
  selectedAddress: ShippingAddress;
  selectedPayment: PaymentMethod;
  selectedDeliveryPlace: DeliveryPlaceOption;
  showAddressModal: boolean;
  showAddAddressModal: boolean;
  showPaymentModal: boolean;
  showPlaceModal: boolean;
  setSelectedAddress: (value: ShippingAddress) => void;
  setSelectedPayment: (value: PaymentMethod) => void;
  setSelectedDeliveryPlace: (value: DeliveryPlaceOption) => void;
  setShowAddressModal: (value: boolean) => void;
  setShowAddAddressModal: (value: boolean) => void;
  setShowPaymentModal: (value: boolean) => void;
  setShowPlaceModal: (value: boolean) => void;
  handleAddAddress: (newAddress: ShippingAddress) => void;
  handlePurchase: () => Promise<void>;
};

export function usePurchasePage(itemId: string | null): UsePurchasePageResult {
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(
    MOCK_ADDRESSES.find((address) => address.isDefault) || MOCK_ADDRESSES[0],
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    MOCK_PAYMENT_METHODS[0],
  );
  const [selectedDeliveryPlace, setSelectedDeliveryPlace] =
    useState<DeliveryPlaceOption>(DEFAULT_DELIVERY_PLACE);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setError("商品が指定されていません");
      setIsLoading(false);
      return;
    }

    const fetchStock = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getStockDetail(itemId);
        if (data.item.status !== 2) {
          setError("この商品は現在購入できません");
          setStock(null);
        } else {
          setStock(data);
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "商品の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [itemId]);

  const handleAddAddress = (newAddress: ShippingAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
  };

  const handlePurchase = async () => {
    if (!stock) return;

    setIsProcessing(true);
    try {
      const paymentMethod =
        selectedPayment.type === "credit_card" ? "card" : selectedPayment.type;

      const orderInput: CreateOrderInput = {
        itemId: stock.item.itemId,
        quantity: 1,
        shippingName: selectedAddress.name,
        shippingZipCode: selectedAddress.postalCode,
        shippingPrefecture: selectedAddress.prefecture,
        shippingCity: selectedAddress.city,
        shippingAddressLine1: selectedAddress.address1,
        shippingAddressLine2: selectedAddress.address2 || null,
        paymentMethod,
      };

      const order = await createOrder(orderInput);
      await payOrder(order.orderId, { paymentMethod });
      setIsPurchased(true);
    } catch (err: unknown) {
      alert(getErrorMessage(err) || "購入処理に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    stock,
    isLoading,
    error,
    isPurchased,
    isProcessing,
    addresses,
    selectedAddress,
    selectedPayment,
    selectedDeliveryPlace,
    showAddressModal,
    showAddAddressModal,
    showPaymentModal,
    showPlaceModal,
    setSelectedAddress,
    setSelectedPayment,
    setSelectedDeliveryPlace,
    setShowAddressModal,
    setShowAddAddressModal,
    setShowPaymentModal,
    setShowPlaceModal,
    handleAddAddress,
    handlePurchase,
  };
}
