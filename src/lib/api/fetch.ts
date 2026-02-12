import { getApiUrl } from "./urls";

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
    this.name = "ApiError";
  }
}

/**
 * 401 Unauthorized エラー時の処理
 */
function handleUnauthorized(): void {
  if (typeof window !== "undefined") {
    // AuthContext に通知
    window.dispatchEvent(new Event("auth:unauthorized"));

    // 自動リダイレクトを停止（ユーザー要望により）
    // 必要な場合は画面側でこのイベントを検知して制御する
    // window.location.href = '/login';
  }
}

/**
 * Cookie から CSRF トークンを取得
 */
function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const csrfCookie = cookies.find((c) => c.trim().startsWith("XSRF-TOKEN="));

  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split("=")[1]);
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
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  addLog(`[API Request] ${options?.method || "GET"} ${endpoint}`);

  // CSRF トークンを取得
  const csrfToken = getCsrfToken();

  // デフォルトオプションの設定
  const defaultHeaders: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
    // CSRF トークンをヘッダーに追加（POSTなどの場合）
    ...(csrfToken && options?.method !== "GET"
      ? { "X-XSRF-TOKEN": csrfToken }
      : {}),
  };

  // bodyが文字列ならJSONとみなしてContent-Typeを設定（もし未設定なら）
  if (
    options?.body &&
    typeof options.body === "string" &&
    !defaultHeaders["Content-Type"]
  ) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const defaultOptions: RequestInit = {
    credentials: "include", // デフォルトでCookieを含める
    ...options,
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      // 401 Unauthorized の場合は自動ログアウト
      if (response.status === 401) {
        addLog("[API Error] 401 Unauthorized - Auto logout");
        handleUnauthorized();
        throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
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
      } catch {
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
