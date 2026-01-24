import { API_ENDPOINTS, fetchApi } from './api/api-client';

export * from './api/api-client'; // 共通部分を再エクスポート

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

export interface CreatePaymentRequest {
    orderId: number;
    userId: number;
    paymentMethod: 'CREDIT_CARD' | 'PAYPAY';
    amount: number;
}

export interface CreatePaymentResponse {
    success: boolean;
    message: string;
    paymentId?: number;
    clientSecret?: string;
    paypayUrl?: string;
    paypayDeeplink?: string;
}

export interface ConfirmPaymentRequest {
    paymentIntentId: string;
}

export interface ReleaseEscrowRequest {
    orderId: number;
}



/**
 * 商品一覧取得
 */
export async function getProducts(): Promise<{ success: boolean; products: Product[] }> {
    return fetchApi(API_ENDPOINTS.PRODUCTS, {
        method: 'GET',
        credentials: 'include',
    });
}

/**
 * 商品作成
 */
export async function createProduct(request: CreateProductRequest): Promise<{
    success: boolean;
    message: string;
    productId?: number
}> {
    return fetchApi(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}

/**
 * 注文作成
 */
export async function createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    return fetchApi(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}

/**
 * 決済開始
 */
export async function createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    console.log('[createPayment] Request:', request);
    console.log('[createPayment] Endpoint:', API_ENDPOINTS.PAYMENT_CREATE);
    console.log('[createPayment] Method: POST');

    return fetchApi(API_ENDPOINTS.PAYMENT_CREATE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}

/**
 * 決済確認（エスクロー化）
 */
export async function confirmPayment(request: ConfirmPaymentRequest): Promise<{ success: boolean; message: string }> {
    return fetchApi(API_ENDPOINTS.PAYMENT_CONFIRM, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}

/**
 * エスクロー解除（出品者への入金）
 */
export async function releaseEscrow(request: ReleaseEscrowRequest): Promise<{ success: boolean; message: string }> {
    return fetchApi(API_ENDPOINTS.PAYMENT_RELEASE_ESCROW, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}
