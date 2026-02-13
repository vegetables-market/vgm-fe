"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserInfo } from "@/types/auth/core";
import { logout as logoutApi } from "@/services/auth/logout";

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

  // 蛻晏屓繝槭え繝ｳ繝域凾縺ｫlocalStorage縺九ｉ隱崎ｨｼ諠・ｱ繧貞ｾｩ蜈・
  useEffect(() => {
    refreshAuthInternal();
  }, []);

  // 401 Unauthorized 繧､繝吶Φ繝医ｒ繝ｪ繝・せ繝ｳ
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

  // 隱崎ｨｼ迥ｶ諷九ｒ蜀崎ｪｭ縺ｿ霎ｼ縺ｿ
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

  // 繝ｭ繧ｰ繧､繝ｳ蜃ｦ逅・
  const login = (userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem("vgm_user", JSON.stringify(userData));
  };

  // 繝ｭ繧ｰ繧｢繧ｦ繝亥・逅・
  const logout = async () => {
    try {
      // 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨・繝ｭ繧ｰ繧｢繧ｦ繝・PI繧貞他縺ｶ
      await logoutApi();
    } catch (error) {
      console.error("Logout API failed:", error);
      // API螟ｱ謨励＠縺ｦ繧ゅΟ繝ｼ繧ｫ繝ｫ縺ｮ迥ｶ諷九・繧ｯ繝ｪ繧｢縺吶ｋ
    } finally {
      setUser(null);
      localStorage.removeItem("vgm_user");
    }
  };

  // 螟夜Κ縺九ｉ蜻ｼ縺ｰ繧後ｋ隱崎ｨｼ迥ｶ諷区峩譁ｰ髢｢謨ｰ
  const refreshAuth = () => {
    refreshAuthInternal();
  };

  // 繝ｦ繝ｼ繧ｶ繝ｼ諠・ｱ繧呈峩譁ｰ
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

// 邁｡蜊倥↓蜻ｼ縺ｳ蜃ｺ縺帙ｋ繝輔ャ繧ｯ
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
