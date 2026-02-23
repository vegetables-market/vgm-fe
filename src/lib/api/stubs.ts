/**
 * 未実装のAPI用のスタブ
 * TODO: 実際のAPIが実装されたら削除してください
 */

// Category API Stub
export const categoryApi = {
  getAllCategories: async () => {
    throw new Error("Category API is not implemented yet");
  },
};

// Favorite API Stub
export const favoriteApi = {
  getFavorites: async (
    _page: number,
    _limit: number,
  ): Promise<{ items: any[]; pagination: any }> => {
    return {
      items: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  },
  removeFavorite: async (_itemId: string) => {
    throw new Error("Favorite API is not implemented yet");
  },
};
