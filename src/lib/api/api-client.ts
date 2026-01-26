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

    // デフォルトオプションの設定
    const defaultOptions: RequestInit = {
        credentials: 'include', // デフォルトでCookieを含める
        ...options,
        headers: {
            ...options?.headers,
        },
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
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
 * UUID でファイル名を生成
 */
function generateFileName(): string {
    return crypto.randomUUID();
}

/**
 * ImageFormatをMIMEタイプ用に変換
 */
function formatToMimeFormat(format: ImageFormat): 'jpeg' | 'png' | 'webp' {
    return format === 'jpg' ? 'jpeg' : format;
}

/**
 * 画像を vgm-media (R2) にアップロード
 */
export async function uploadImage(
    file: File,
    format: ImageFormat = 'jpg',
): Promise<string> {
    const maxSize = 300 * 1024;
    if (file.size > maxSize) {
        throw new Error(`ファイルサイズが大きすぎます (最大 ${maxSize / 1024}KB)`);
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('画像ファイルのみアップロード可能です');
    }

    const fileName = generateFileName();
    const arrayBuffer = await file.arrayBuffer();
    const mediaUrl = getMediaUrl();
    const mimeFormat = formatToMimeFormat(format);
    const contentType = `image/${mimeFormat}`;

    try {
        const response = await fetch(`${mediaUrl}/${fileName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
            },
            body: arrayBuffer,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError(response.status, `アップロード失敗: ${errorText}`);
        }

        const result = await response.json();
        return result.id || fileName;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(`画像のアップロードに失敗しました: ${error}`);
    }
}
