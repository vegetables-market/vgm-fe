/**
 * API エンドポイント定数
 */
export const API_ENDPOINTS = {
    TEST: '/api/test',
    REGISTER: '/v1/auth/signup',
    LOGIN: '/v1/auth/login',
    VERIFY_EMAIL: '/v1/auth/verify-email',
    USER: '/api/auth/user',
    TOTP_ENABLE: '/api/auth/totp/enable',
    TOTP_VERIFY: '/api/auth/totp/verify-and-enable',
    TOTP_DISABLE: '/api/auth/totp/disable',
    LOGIN_TOTP: '/api/auth/login/totp',
    // 商品関連
    ITEMS: '/v1/market/items',
    // 注文関連
    ORDERS: '/api/orders',
    // 決済関連
    PAYMENT_CREATE: '/api/payment/create',
    PAYMENT_CONFIRM: '/api/payment/confirm',
    PAYMENT_RELEASE_ESCROW: '/api/payment/release-escrow',
    PAYMENT_REFUND: '/api/payment/refund',
    PAYMENT_STATUS: '/api/payment',
} as const;
