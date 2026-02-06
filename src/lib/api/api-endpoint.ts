/**
 * API エンドポイント定数
 */
export const API_ENDPOINTS = {
    TEST: '/test',
    REGISTER: '/v1/auth/signup',
    LOGIN: '/v1/auth/login',
    USER: '/auth/user',
    TOTP_ENABLE: '/auth/totp/enable',
    TOTP_VERIFY: '/auth/totp/verify-and-enable',
    TOTP_DISABLE: '/auth/totp/disable',
    LOGIN_TOTP: '/auth/login/totp',
    // 商品関連
    ITEMS: '/v1/market/items',
    CATEGORIES: '/v1/market/categories',
    // 注文関連
    ORDERS: '/orders',
    // 決済関連
    PAYMENT_CREATE: '/payment/create',
    PAYMENT_CONFIRM: '/payment/confirm',
    PAYMENT_RELEASE_ESCROW: '/payment/release-escrow',
    PAYMENT_REFUND: '/payment/refund',
    PAYMENT_STATUS: '/payment',
} as const;
