import { API_ENDPOINTS, fetchApi } from './api/client';

export * from './api/client'; // 共通部分を再エクスポート
export * from './api/types'; // 型定義を再エクスポート

// ==================== 新しいサービスの再エクスポート ====================
export * from './api/services/item';
export * from './api/services/upload';
export * from './api/services/order';
export * from './api/services/payment';
export * from './api/services/cart';
export * from './api/services/category';
export * from './api/services/favorite';

// ==================== Legacy API (削除予定) ====================

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

// ==================== Legacy Category (互換性のため残す) ====================

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
