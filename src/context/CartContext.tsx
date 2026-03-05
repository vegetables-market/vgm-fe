"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 商品の型定義
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  producer: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const storageKey = "vgm_cart";
  const legacyStorageKey = "harvest_cart";

  // 初期ロード時にローカルストレージからカート情報を復元
  useEffect(() => {
    const savedCart =
      localStorage.getItem(storageKey) ??
      localStorage.getItem(legacyStorageKey);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
      localStorage.setItem(storageKey, savedCart);
      localStorage.removeItem(legacyStorageKey);
    }
  }, []);

  // カートが更新されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems]);

  // カートに追加
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // すでにある商品は数量を増やす
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // 新しい商品は追加
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              return { ...item, quantity: Math.max(0, quantity) }; // 0未満にはしない
            }
            return item;
          })
          .filter((item) => item.quantity > 0), // 0になったら削除する
    );
  };

  // カートから削除
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // カートを空にする
  const clearCart = () => {
    setCartItems([]);
  };

  // 合計金額
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // 合計点数
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 簡単に呼び出せるフック
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
