import { useState } from "react";
import { loginWithGoogle, loginWithMicrosoft, loginWithGithub } from "@/lib/firebase/auth";
import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import { useAuth } from "@/context/AuthContext";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";

interface LoginResponse {
  status: string;
  user: {
    username: string;
    display_name: string;
    email: string;
    avatar_url: string | null;
    is_email_verified: boolean;
  } | null;
  flow_id?: string;
  message?: string;
}

export function useFirebaseOAuthLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleOAuthLogin = async (provider: "google" | "microsoft" | "github") => {
    setLoading(true);
    try {
      let token = "";
      let endpoint = "";

      // 1. Firebase Login -> Get ID Token
      switch (provider) {
        case "google":
          token = await loginWithGoogle();
          endpoint = API_ENDPOINTS.AUTH_GOOGLE;
          break;
        case "microsoft":
          token = await loginWithMicrosoft();
          endpoint = API_ENDPOINTS.AUTH_MICROSOFT;
          break;
        case "github":
          token = await loginWithGithub();
          endpoint = API_ENDPOINTS.AUTH_GITHUB;
          break;
      }

      // 2. Send token to Backend
      const response = await fetchApi<LoginResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      // 3. Authenticated successfully (Session Cookie set)
      if (response && response.status === "AUTHENTICATED" && response.user) {
        // Save user info to AuthContext (which also saves to localStorage)
        login({
          username: response.user.username,
          displayName: response.user.display_name,
          email: response.user.email,
          avatarUrl: response.user.avatar_url,
          isEmailVerified: response.user.is_email_verified,
        });
        
        // Settings/OAuthページからの連携フローの場合、そこに戻る
        const urlParams = new URLSearchParams(window.location.search);
        const rawRedirect =
          urlParams.get("redirect_to") || urlParams.get("redirect");
        window.location.href = safeRedirectTo(rawRedirect) || "/";
        
      } else {
        throw new Error(response.message || "ログインに失敗しました");
      }

    } catch (error) {
      console.error(`${provider} Login failed`, error);
      alert(`${provider}ログインに失敗しました。`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleOAuthLogin,
  };
}
