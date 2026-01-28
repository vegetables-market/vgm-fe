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

        // ログインページにリダイレクト（現在のURLを保存）
        const currentPath = window.location.pathname;
        const redirectUrl = currentPath !== '/login'
            ? `/login?redirect=${encodeURIComponent(currentPath)}`
            : '/login';

        window.location.href = redirectUrl;
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
    const url = `${apiUrl}${endpoint}`;

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
    const defaultOptions: RequestInit = {
        credentials: 'include', // デフォルトでCookieを含める
        ...options,
        headers: {
            ...options?.headers,
            // CSRF トークンをヘッダーに追加（POSTなどの場合）
            ...(csrfToken && options?.method !== 'GET' && { 'X-XSRF-TOKEN': csrfToken }),
        },
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            // 401 Unauthorized の場合は自動ログアウト
            if (response.status === 401) {
                addLog('[API Error] 401 Unauthorized - Auto logout');
                handleUnauthorized();
                throw new ApiError(401, 'Unauthorized');
            }

            let errorMessage = `API Error: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (jsonError) {
                // JSONパース失敗
            }

            addLog(`[API Error] ${response.status}: ${errorMessage}`);
            throw new ApiError(response.status, errorMessage);
        }

        const data = await response.json();
        addLog(`[API Success] ${endpoint}`);
        return data;
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
            throw new ApiError(response.status, `アップロード失敗: ${errorText}`);
        }

        const result = await response.json();
        return result.id || filename;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(`画像のアップロードに失敗しました: ${error}`);
    }
}
