import { API_ENDPOINTS, fetchApi } from './api/client';

export * from './api/client'; // 共通部分を再エクスポート

// ==================== 商品・注文・決済関連 ====================

export interface TestItem {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    sellerId: number;
    sellerName: string;
    status: string;
    category?: string;
    createdAt: string;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    sellerId: number;
    category?: string;
    stock?: number;
}

export interface CreateOrderRequest {
    buyerId: number;
    productId: number;
    shippingAddress?: string;
    shippingPostalCode?: string;
    shippingRecipientName?: string;
    shippingPhoneNumber?: string;
}

export interface CreateOrderResponse {
    success: boolean;
    message: string;
    orderId?: number;
    totalAmount?: number;
    platformFee?: number;
    sellerAmount?: number;
}

export async function getTestItems(): Promise<TestItem[]> {
    return await fetchApi<TestItem[]>('/api/test-items', { method: 'GET' });
}

export async function createProduct(productData: CreateProductRequest): Promise<Product> {
    return await fetchApi<Product>('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    });
}

export async function getProduct(id: number): Promise<Product> {
    return await fetchApi<Product>(`/api/products/${id}`, { method: 'GET' });
}

export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return await fetchApi<CreateOrderResponse>('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
}

export async function getOrder(orderId: number): Promise<any> {
    return await fetchApi(`/api/orders/${orderId}`, { method: 'GET' });
}

export async function getOrders(buyerId: number): Promise<any[]> {
    return await fetchApi(`/api/orders?buyerId=${buyerId}`, { method: 'GET' });
}

export async function getPaymentIntent(orderId: number): Promise<any> {
    return await fetchApi(`/api/payment/intent/${orderId}`, { method: 'GET' });
}

export async function confirmPayment(orderId: number, paymentIntentId: string): Promise<any> {
    return await fetchApi(`/api/payment/confirm/${orderId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
    });
}

// ==================== Item (Market) 関連 ====================

// 商品ステータス定義
export const ITEM_STATUS = {
    WORK_IN_PROGRESS: 0, // 出品作業中
    DRAFT: 1,            // 下書き
    ON_SALE: 2,          // 出品中
    TRADING: 3,          // 取引中
    SOLD_OUT: 4,         // 売り切れ
    SUSPENDED: 5,        // 停止
} as const;

export type ItemStatus = typeof ITEM_STATUS[keyof typeof ITEM_STATUS];

export interface Item {
    id: number;
    name: string | null;
    price: number | null;
    status: ItemStatus;
    imageUrl?: string | null;
    createdAt: string;
}

export interface CreateDraftResponse {
    item_id: number;
}

export interface LinkImagesRequest {
    filenames: string[];
}

export const getMyItems = async () => {
    return await fetchApi<Item[]>(`${API_ENDPOINTS.ITEMS}/me`, {
        method: 'GET',
    });
};

export const createDraft = async (): Promise<CreateDraftResponse> => {
    return await fetchApi<CreateDraftResponse>(`${API_ENDPOINTS.ITEMS}/draft`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const linkImages = async (itemId: number, filenames: string[]) => {
    return await fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filenames }),
    });
};

export const updateItem = async (itemId: number, data: any) => {
    return await fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const deleteItem = async (itemId: number) => {
    return await fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
        method: 'DELETE',
    });
};

export const updateItemStatus = async (itemId: number, status: number) => {
    return await fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
};


// Legacy support (optional, can be removed if not used)
export const createItem = async (data: any) => {
    // If we want to support the old flow, we might need a separate endpoint or just map to draft->publish here ?
    // For now, keeping it as a wrapper around POST /items (which is deprecated/legacy in controller)
  return await fetchApi(`${API_ENDPOINTS.ITEMS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// ==================== Category 関連 ====================

export interface Category {
    categoryId: number;
    name: string;
    parentCategoryId: number | null;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await fetchApi<{ categories: Category[] }>(`${API_ENDPOINTS.CATEGORIES}`, {
        method: 'GET',
    });
    return response.categories;
};

// ==================== Upload Token 関連 ====================

export interface UploadTokenResponse {
    token: string;
    filename: string;
    expiresAt: number;
}

export const getUploadToken = async (): Promise<UploadTokenResponse> => {
    return await fetchApi<UploadTokenResponse>(`${API_ENDPOINTS.ITEMS}/upload-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// ==================== Direct Upload 関連 ====================

export const uploadImageDirect = async (token: string, filename: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = process.env.NEXT_PUBLIC_MEDIA_UPLOAD_URL || 'http://localhost:8787/upload';
    
    await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Filename': filename,
        },
        body: formData,
    });
};
