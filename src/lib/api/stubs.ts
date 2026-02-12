/**
 * 未実装のAPI用のスタブ
 * TODO: 実際のAPIが実装されたら削除してください
 */

// Cart API Stub
export const cartApi = {
  getCart: async () => {
    throw new Error('Cart API is not implemented yet');
  },
  updateCartItemQuantity: async (_itemId: number, _quantity: number) => {
    throw new Error('Cart API is not implemented yet');
  },
  removeFromCart: async (_itemId: number) => {
    throw new Error('Cart API is not implemented yet');
  },
};

// Category API Stub
export const categoryApi = {
  getAllCategories: async () => {
    throw new Error('Category API is not implemented yet');
  },
};

// Favorite API Stub
export const favoriteApi = {
  getFavorites: async (_page: number, _limit: number): Promise<{ items: any[]; pagination: any }> => {
    return { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },
  removeFavorite: async (_itemId: string) => {
    throw new Error('Favorite API is not implemented yet');
  },
};
