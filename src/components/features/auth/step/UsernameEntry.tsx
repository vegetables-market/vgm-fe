"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";
import { checkUsername } from "@/services/auth/check-username";
import { getInitialUsernameSuggestions } from "@/services/auth/get-initial-username-suggestions";
import { SignupFormData } from "@/types/auth/user";

interface UsernameEntryProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
}

export default function UsernameEntry({ formData, setFormData, onNext }: UsernameEntryProps) {
  const [showError, setShowError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // キャッシュとAbortControllerのためのRef
  const checkCache = useRef<Map<string, { available: boolean; message?: string; suggestions?: string[] }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // 初期サジェスト取得
  useEffect(() => {
    // すでに入力がある場合やサジェストがある場合は何もしない（戻ってきた場合など）
    if (formData.username || suggestions.length > 0) return;

    const fetchInitialSuggestions = async () => {
        try {
            const result = await getInitialUsernameSuggestions();
            if (result.suggestions && result.suggestions.length > 0) {
              setSuggestions(result.suggestions);
            }
        } catch (error) {
            console.error("Failed to fetch initial suggestions", error);
        }
    };
    fetchInitialSuggestions();
  }, []); // Mount時に一度だけ実行

  const isFormatValid = useMemo(() => {
    // 3文字以上、英数字とアンダースコアのみ
    return formData.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(formData.username);
  }, [formData.username]);

  // 非同期チェック関数
  const checkAvailability = async (username: string) => {
    if (!username || username.length < 3) {
        setIsAvailable(null);
        return;
    }

    // キャッシュ確認
    if (checkCache.current.has(username)) {
        const cached = checkCache.current.get(username)!;
        setChecking(false);
        setSuggestions(cached.suggestions || []); // 常にサジェストをセット
        
        if (!cached.available) {
            setUsernameError(cached.message || "このユーザー名は既に使用されています");
            setIsAvailable(false);
        } else {
            setUsernameError("");
            setIsAvailable(true);
        }
        return;
    }
    
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setChecking(true);
    setUsernameError("");
    setSuggestions([]);
    setIsAvailable(null);
    
    try {
      const result = await checkUsername(username);
      
      if (controller.signal.aborted) return;

      // キャッシュ保存
      checkCache.current.set(username, result);
      
      // 共通処理: サジェスト更新
      setSuggestions(result.suggestions || []);

      if (!result.available) {
        setUsernameError(result.message || "このユーザー名は既に使用されています");
        setIsAvailable(false);
      } else {
        setUsernameError("");
        setIsAvailable(true);
      }
    } catch (error) {
       if (controller.signal.aborted) return;
       console.error("Username check failed", error);
    } finally {
       if (!controller.signal.aborted) {
           setChecking(false);
           abortControllerRef.current = null;
       }
    }
  };

  const debouncedCheck = useDebouncedCallback(checkAvailability, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, username: val }));
    setUsernameError(""); 
    setSuggestions([]);
    setIsAvailable(null);

    // フォーマットOKならチェック開始
    if (val.length >= 3 && /^[a-zA-Z0-9_]+$/.test(val)) {
        setChecking(true);
        debouncedCheck(val);
    } else {
        setChecking(false);
    }
  };

  const applySuggestion = (sugg: string) => {
      setFormData(prev => ({ ...prev, username: sugg }));
      setUsernameError("");
      setSuggestions([]);
      setIsAvailable(true); // サジェストされたものは基本OK
      // 念のためキャッシュにも登録しておく
      checkCache.current.set(sugg, { available: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormatValid) {
      setShowError(true);
      return;
    }
    // チェック中、またはAPIエラーがあれば進まない
    if (checking || usernameError) return;

    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 1 / 4</p>
        <p className="text-base font-bold text-white">ユーザーIDを設定</p>
      </div>

      <section>
        <div className="mb-2 w-full">
          <span className="text-[13px] font-bold text-white">ユーザーID (ログイン用)</span>
        </div>
        <div className="relative">
            <input
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="user_name_123"
            className={`mb-1 h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
                (showError && !isFormatValid) || usernameError
                ? "!border-red-400"
                : isAvailable 
                    ? "!border-green-500" 
                    : "!border-white/70 focus:!border-white"
            }`}
            autoFocus
            />
        </div>
        
        <p className="text-[11px] text-gray-400 mt-1">
          3文字以上の英数字とアンダースコアが使用できます。
        </p>
        
        {/* クライアントバリデーションエラー */}
        {showError && !isFormatValid && (
          <div className="mt-2 flex items-center text-xs text-red-400">
            <FaCircleExclamation className="mr-1" />
            <p>有効なユーザーIDを入力してください。</p>
          </div>
        )}

        {/* API重複エラー */ }
        { usernameError && (
          <div className="mt-2 flex items-center text-xs text-red-400">
            <FaCircleExclamation className="mr-1" />
            <p>{usernameError}</p>
          </div>
        ) }
        
        {/* 使用可能メッセージ */ }
        { isAvailable && !usernameError && !checking && (
          <div className="mt-2 flex items-center text-xs text-green-500">
            <p>このIDは使用可能です</p>
          </div>
        ) }

        {/* サジェスト (常時表示) */ }
        { suggestions.length > 0 && (
          <div className="mt-3">
             <p className="text-[11px] text-gray-400 mb-1.5">おすすめのID:</p>
             <div className="flex flex-wrap gap-2">
                 {suggestions.map((sugg) => (
                     <button
                       key={sugg}
                       type="button"
                       onClick={() => applySuggestion(sugg)}
                       className="px-3 py-1 bg-zinc-800 rounded-full text-[11px] text-white border border-zinc-700 hover:bg-zinc-700 transition-colors"
                     >
                       {sugg}
                     </button>
                 ))}
             </div>
          </div>
        ) }

        {/* チェック中メッセージ */}
        {checking && !usernameError && (
            <div className="mt-1 text-xs text-gray-500">
                確認中...
            </div>
        )}

      </section>

      <button
        type="submit"
        disabled={!isFormatValid || checking || !!usernameError}
        className={`mt-6 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        次へ
      </button>
    </form>
  );
}
