import { ApiError } from './api-client';

/**
 * HTTPステータスコードに応じたデフォルトメッセージ
 */
const ERROR_MESSAGES: Record<number, string> = {
    400: '入力内容に誤りがあります。内容を確認してください。',
    401: '認証に失敗しました。再度ログインしてください。',
    403: 'アクセス権限がありません。',
    404: 'リクエストされたリソースが見つかりません。',
    409: '既に登録されている情報です。',
    500: 'サーバーでエラーが発生しました。しばらく時間をおいて再度お試しください。',
    503: 'サービスが一時的に利用できません。メンテナンス中の可能性があります。',
};

/**
 * エラーオブジェクトからユーザー向けのメッセージを抽出する
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        // バックエンドから具体的なメッセージが返ってきている場合はそれを優先
        if (error.message && !error.message.startsWith('API Error:')) {
            // バリデーションエラーなどで詳細がある場合はそれを追加
            if (error.details && error.details.length > 0) {
                return `${error.message}\n${error.details.join('\n')}`;
            }
            return error.message;
        }
        // ステータスコードに基づくデフォルトメッセージ
        return ERROR_MESSAGES[error.status] || `予期せぬエラーが発生しました (${error.status})`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return '通信に失敗しました。ネットワーク接続を確認してください。';
}

/**
 * 特定のエラー（401など）に対する共通処理
 */
export function handleGlobalError(error: unknown, router?: any): void {
    if (error instanceof ApiError) {
        if (error.status === 401) {
            // 認証切れの場合の処理
            if (typeof window !== 'undefined') {
                localStorage.removeItem('vgm_user');
                if ((window as any).refreshAuth) (window as any).refreshAuth();
                if (router) router.push('/login');
            }
        }
    }
}
