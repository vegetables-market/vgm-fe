export type StockDetail = {
  item: {
    itemId: number;
    title: string;
    description: string | null;
    price: number;
    quantity: number;
    categoryId: number | null;
    categoryName: string | null;
    condition: number;
    status: number;
    likesCount: number;
    isLiked: boolean;
    brand: string | null;
    weight: number | null;
    shippingPayerType: number;
    images: Array<{
      imageId: number;
      imageUrl: string;
      displayOrder: number;
    }>;
    seller: {
      userId: number;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      ratingAverage: number | null;
      ratingCount: number;
    };
    createdAt: string;
    updatedAt: string;
  };
  relatedItems: Array<{
    itemId: number;
    title: string;
    price: number;
    thumbnailUrl: string | null;
  }>;
};
