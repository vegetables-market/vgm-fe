import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/api/error-handler";
import { resolvePaymentMethod } from "@/lib/market/checkout/resolve-payment-method";
import type { StockDetail } from "@/lib/market/stocks/types/stock-detail";
import {
  completeCheckoutPayment,
  startCheckout,
} from "@/service/market/checkout/confirm-purchase";
import { getStockDetail } from "@/service/market/stocks/get-stock-detail";
import {
  DEFAULT_DELIVERY_PLACE,
  MOCK_PAYMENT_METHODS,
} from "@/lib/mockData";
import type {
  DeliveryPlaceOption,
  PaymentMethod,
  ShippingAddress,
} from "@/lib/types";
import { getAddresses } from "@/service/user/addresses/get-addresses";
import { createAddress } from "@/service/user/addresses/create-address";
import {
  mapShippingAddressToUpsertRequestDto,
  mapUserAddressDtoToShippingAddress,
} from "@/service/user/addresses/mappers";

type UsePurchasePageResult = {
  stock: StockDetail | null;
  isLoading: boolean;
  error: string;
  isPurchased: boolean;
  isProcessing: boolean;
  addresses: ShippingAddress[];
  selectedAddress: ShippingAddress | null;
  selectedPayment: PaymentMethod;
  selectedDeliveryPlace: DeliveryPlaceOption;
  showAddressModal: boolean;
  showAddAddressModal: boolean;
  showPaymentModal: boolean;
  showPlaceModal: boolean;
  showStripeModal: boolean;
  stripeClientSecret: string | null;
  stripeAmount: number | null;
  setSelectedAddress: (value: ShippingAddress | null) => void;
  setSelectedPayment: (value: PaymentMethod) => void;
  setSelectedDeliveryPlace: (value: DeliveryPlaceOption) => void;
  setShowAddressModal: (value: boolean) => void;
  setShowAddAddressModal: (value: boolean) => void;
  setShowPaymentModal: (value: boolean) => void;
  setShowPlaceModal: (value: boolean) => void;
  handleStripeModalClose: () => void;
  handleStripePaymentSuccess: (paymentIntentId: string) => Promise<void>;
  handleAddAddress: (newAddress: ShippingAddress) => Promise<void>;
  handlePurchase: () => Promise<void>;
};

export function usePurchasePage(itemId: string | null): UsePurchasePageResult {
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(
    null,
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
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeAmount, setStripeAmount] = useState<number | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

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
        const [stockData, addressData] = await Promise.all([
          getStockDetail(itemId),
          getAddresses("DELIVERY"),
        ]);
        const fetchedAddresses = addressData.addresses.map(
          mapUserAddressDtoToShippingAddress,
        );

        setAddresses(fetchedAddresses);
        setSelectedAddress(
          fetchedAddresses.find((address) => address.isDefault) ||
            fetchedAddresses[0] ||
            null,
        );

        if (stockData.item.status !== 2) {
          setError("この商品は現在購入できません");
          setStock(null);
        } else {
          setStock(stockData);
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "商品の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [itemId]);

  const handleAddAddress = async (newAddress: ShippingAddress) => {
    const requestDto = mapShippingAddressToUpsertRequestDto(newAddress);
    const response = await createAddress(requestDto, "DELIVERY");
    const createdAddress = mapUserAddressDtoToShippingAddress(response.address);

    setAddresses((prev) => {
      const next = [...prev, createdAddress];
      return next.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    });
    setSelectedAddress(createdAddress);
  };

  const handlePurchase = async () => {
    if (!stock) return;
    if (!selectedAddress) {
      setError("住所が設定されていません");
      return;
    }

    setIsProcessing(true);
    try {
      const paymentMethod = resolvePaymentMethod(selectedPayment);
      const checkout = await startCheckout({
        itemId: stock.item.itemId,
        quantity: 1,
        shippingName: selectedAddress.name,
        shippingZipCode: selectedAddress.postalCode,
        shippingPrefecture: selectedAddress.prefecture,
        shippingCity: selectedAddress.city,
        shippingAddressLine1: selectedAddress.address1,
        shippingAddressLine2: selectedAddress.address2 || null,
        paymentMethod,
      });

      if (selectedPayment.type === "credit_card") {
        if (!checkout.clientSecret) {
          throw new Error("カード決済の準備に失敗しました。時間をおいて再試行してください。");
        }

        setPendingOrderId(checkout.orderId);
        setStripeClientSecret(checkout.clientSecret);
        setStripeAmount(checkout.totalAmount);
        setShowStripeModal(true);
        return;
      }

      await completeCheckoutPayment(checkout.orderId, {
        paymentMethod,
      });
      setIsPurchased(true);
    } catch (err: unknown) {
      alert(getErrorMessage(err) || "購入処理に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntentId: string) => {
    if (pendingOrderId == null) {
      alert("注文情報が失われました。もう一度購入手続きをやり直してください。");
      return;
    }

    setIsProcessing(true);
    try {
      await completeCheckoutPayment(pendingOrderId, {
        paymentMethod: resolvePaymentMethod(selectedPayment),
        paymentIntentId,
      });
      setShowStripeModal(false);
      setStripeClientSecret(null);
      setStripeAmount(null);
      setPendingOrderId(null);
      setIsPurchased(true);
    } catch (err: unknown) {
      alert(getErrorMessage(err) || "決済確定に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeModalClose = () => {
    setShowStripeModal(false);
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
    showStripeModal,
    stripeClientSecret,
    stripeAmount,
    setSelectedAddress,
    setSelectedPayment,
    setSelectedDeliveryPlace,
    setShowAddressModal,
    setShowAddAddressModal,
    setShowPaymentModal,
    setShowPlaceModal,
    handleStripeModalClose,
    handleStripePaymentSuccess,
    handleAddAddress,
    handlePurchase,
  };
}
