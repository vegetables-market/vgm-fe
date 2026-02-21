"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserInfo } from "@/types/auth/core";
import { logout as logoutApi } from "@/service/auth/logout";

type AuthContextType = {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: UserInfo) => void;
  logout: () => Promise<void>;
  refreshAuth: () => void;
  updateUser: (user: UserInfo) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初回マウント時にlocalStorageから認証情報を復元
  useEffect(() => {
    refreshAuthInternal();
  }, []);

  // 401 Unauthorized イベントをリッスン
  useEffect(() => {
    const handleUnauthorizedEvent = () => {
      setUser(null);
      localStorage.removeItem("vgm_user");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorizedEvent);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorizedEvent);
    };
  }, []);

  // 認証状態を再読み込み
  const refreshAuthInternal = () => {
    try {
      const savedUser = localStorage.getItem("vgm_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ログイン処理
  const login = (userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem("vgm_user", JSON.stringify(userData));
  };

  // ログアウト処理
  const logout = async () => {
    try {
      // バックエンドのログアウトAPIを呼ぶ
      await logoutApi();
    } catch (error) {
      console.error("Logout API failed:", error);
      // API失敗してもローカルの状態はクリアする
    } finally {
      setUser(null);
      localStorage.removeItem("vgm_user");
    }
  };

  // 外部から呼ばれる認証状態更新関数
  const refreshAuth = () => {
    refreshAuthInternal();
  };

  // ユーザー情報を更新
  const updateUser = (userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem("vgm_user", JSON.stringify(userData));
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 簡単に呼び出せるフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
