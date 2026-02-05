import { API_ENDPOINTS } from './api-endpoint';

/**
 * API クライアント共通設定・関数
 */

/**
 * 画像フォーマット型
 */
export type ImageFormat = 'jpg' | 'png' | 'webp';

/**
 * バックエンド API の URL を取得
 */
export const getApiUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

/**
 * メディアサーバー (vgm-media) の URL を取得
 */
export const getMediaUrl = (): string => {
    return process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8787';
};

export { API_ENDPOINTS };

/**
 * API エラー型
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public errorCode?: string,
        public details?: string[],
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * 401 Unauthorized エラー時の処理
 */
function handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
        // AuthContext に通知
        window.dispatchEvent(new Event('auth:unauthorized'));

        // localStorage をクリア
        localStorage.removeItem('vgm_user');

        // 自動リダイレクトを停止（ユーザー要望により）
        // 必要な場合は画面側でこのイベントを検知して制御する
        // window.location.href = '/login';
    }
}

/**
 * Cookie から CSRF トークンを取得
 */
function getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(c => c.trim().startsWith('XSRF-TOKEN='));

    if (csrfCookie) {
        return decodeURIComponent(csrfCookie.split('=')[1]);
    }

    return null;
}

/**
 * 汎用 API フェッチ関数
 */
export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/api${endpoint}`;

    // デバッグログ出力
    const addLog = (msg: string) => {
        if (typeof window !== 'undefined' && (window as any).addAuthLog) {
            (window as any).addAuthLog(msg);
        }
    };

    addLog(`[API Request] ${options?.method || 'GET'} ${endpoint}`);

    // CSRF トークンを取得
    const csrfToken = getCsrfToken();

    // デフォルトオプションの設定
    const defaultHeaders: Record<string, string> = {
        ...(options?.headers as Record<string, string>),
        // CSRF トークンをヘッダーに追加（POSTなどの場合）
        ...(csrfToken && options?.method !== 'GET' ? { 'X-XSRF-TOKEN': csrfToken } : {}),
    };

    // bodyが文字列ならJSONとみなしてContent-Typeを設定（もし未設定なら）
    if (options?.body && typeof options.body === 'string' && !defaultHeaders['Content-Type']) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const defaultOptions: RequestInit = {
        credentials: 'include', // デフォルトでCookieを含める
        ...options,
        headers: defaultHeaders,
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            // 401 Unauthorized の場合は自動ログアウト
            if (response.status === 401) {
                addLog('[API Error] 401 Unauthorized - Auto logout');
                handleUnauthorized();
                addLog('[API Error] 401 Unauthorized - Auto logout');
                handleUnauthorized();
                throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }

            let errorMessage = `API Error: ${response.status}`;
            let errorCode: string | undefined;
            let details: string[] | undefined;

            try {
                const errorData = await response.json();
                if (errorData) {
                    if (errorData.message) errorMessage = errorData.message;
                    if (errorData.errorCode) errorCode = errorData.errorCode;
                    if (errorData.details) details = errorData.details;
                }
            } catch (jsonError) {
                // JSONパース失敗
            }

            addLog(`[API Error] ${response.status}: ${errorMessage}`);
            throw new ApiError(response.status, errorMessage, errorCode, details);
        }

        // ボディが空の場合は空のオブジェクトを返す（Void対応）
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        addLog(`[API Success] ${endpoint}`);
        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        const networkError = `Network Error: ${error}`;
        addLog(`[API Network Error] ${networkError}`);
        throw new Error(networkError);
    }
}

/**
 * ImageFormatをMIMEタイプ用に変換
 */
function formatToMimeFormat(format: ImageFormat): 'jpeg' | 'png' | 'webp' {
    return format === 'jpg' ? 'jpeg' : format;
}

/**
 * 画像を vgm-media (R2) にアップロード
 * JWTトークンによる認証付き
 */
export async function uploadImage(
    file: File,
    format: ImageFormat = 'jpg',
    token: string,
    filename: string, // バックエンドから指定されたファイル名を使用
): Promise<string> {
    const maxSize = 300 * 1024;
    if (file.size > maxSize) {
        throw new Error(`ファイルサイズが大きすぎます (最大 ${maxSize / 1024}KB)`);
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('画像ファイルのみアップロード可能です');
    }

    // filenameはBE発行のものを使用するためgenerateFileNameは不要
    const arrayBuffer = await file.arrayBuffer();
    const mediaUrl = getMediaUrl();
    const mimeFormat = formatToMimeFormat(format);
    const contentType = `image/${mimeFormat}`;

    try {
        const response = await fetch(`${mediaUrl}/${filename}`, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
                'Authorization': `Bearer ${token}` // JWTトークン付与
            },
            body: arrayBuffer,
        });

        if (!response.ok) {
            const errorText = await response.text();

            throw new ApiError(response.status, `アップロード失敗: ${errorText}`, 'UPLOAD_ERROR');
        }

        const result = await response.json();
        return result.id || filename;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(`画像のアップロードに失敗しました: ${String(error)}`);
    }
}

/**
 * アップロード用トークン取得 (Admin)
 */
export async function getAdminUploadToken(filename: string): Promise<{ token: string; filename: string }> {
    return fetchApi<{ token: string; filename: string }>(`/v1/admin/media/upload-token?filename=${filename}`, {
        method: 'GET',
    });
}

/**
 * ユーザー名の重複チェック
 */
export async function checkUsername(username: string): Promise<{ available: boolean; message?: string; suggestions?: string[] }> {
    return fetchApi<{ available: boolean; message?: string; suggestions?: string[] }>(`/v1/auth/check-username?username=${username}`, {
        method: 'GET',
    });
}

/**
 * 初期おすすめユーザー名の取得
 */
export async function getInitialUsernameSuggestions(): Promise<{ suggestions: string[] }> {
    return fetchApi<{ suggestions: string[] }>(`/v1/auth/suggestions`, {
        method: 'GET',
    });
}

/**
 * 認証フロー開始 (Login or Register判定)
 */
export async function initAuthFlow(email: string): Promise<{ flow: "LOGIN" | "REGISTER" | "CHALLENGE"; flow_id?: string; expires_at?: string; next_resend_at?: string }> {
    return fetchApi<{ flow: "LOGIN" | "REGISTER" | "CHALLENGE"; flow_id?: string; expires_at?: string; next_resend_at?: string }>(`/v1/auth/init-flow`, {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

/**
 * 認証コード再送信
 */
export async function resendAuthCode(flow_id: string): Promise<{ flow_id: string; expires_at: string; message: string; next_resend_at: string }> {
    return fetchApi<{ flow_id: string; expires_at: string; message: string; next_resend_at: string }>(`/v1/auth/resend-code`, {
        method: 'POST',
        body: JSON.stringify({ flow_id }),
    });
}

/**
 * 認証コードの検証 (事前認証フロー用)
 */
export async function verifyAuthCode(flow_id: string, code: string): Promise<{ verified: boolean; email: string }> {
    return fetchApi<{ verified: boolean; email: string }>(`/v1/auth/verify-code`, {
        method: 'POST',
        body: JSON.stringify({ flow_id, code }),
    });
}

