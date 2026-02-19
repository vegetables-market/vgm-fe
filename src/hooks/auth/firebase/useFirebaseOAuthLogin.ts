import { useState } from "react";
import { loginWithGoogle, loginWithMicrosoft, loginWithGithub } from "@/lib/firebase/auth";
import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import { useAuth } from "@/context/AuthContext";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";

// Backend response matches snake_case strategy
interface ApiLoginResponse {
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
  oauth_token?: string;
  oauth_provider?: string;
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
      const response = await fetchApi<ApiLoginResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      // 3. Handle specific status: OAUTH_REGISTRATION_REQUIRED
      if (response && response.status === "OAUTH_REGISTRATION_REQUIRED" && response.oauth_token) {
           const params = new URLSearchParams();
           // NewUser result provides email/name in the 'user' object even if user doesn't exist in DB yet
           params.set("email", response.user?.email || "");
           params.set("name", response.user?.display_name || "");
           params.set("use_oauth_session", "true");
           
           // Store token in sessionStorage as it might be too large for URL
           try {
               sessionStorage.setItem("signup_oauth_token", response.oauth_token);
               sessionStorage.setItem("signup_oauth_provider", response.oauth_provider || "");
           } catch (e) {
               console.warn("Session storage failed", e);
           }

           const redirect = safeRedirectTo("/signup") + "?" + params.toString();
           window.location.href = redirect;
           return;
      }

      // 4. Authenticated successfully (Session Cookie set)
      if (response && response.status === "AUTHENTICATED" && response.user) {
        // Save user info to AuthContext (which also saves to localStorage)
        login({
          username: response.user.username,
          displayName: response.user.display_name,
          email: response.user.email,
          avatarUrl: response.user.avatar_url,
          isEmailVerified: response.user.is_email_verified,
        });
        
        // Settings/OAuthペ�Eジからの連携フローの場合、そこに戻めE
        const urlParams = new URLSearchParams(window.location.search);
        const rawRedirect =
          urlParams.get("redirect_to") || urlParams.get("redirect");
        window.location.href = safeRedirectTo(rawRedirect) || "/";
        
      } else {
        throw new Error(response.message || "ログインに失敗しました");
      }

    } catch (error) {
      const firebaseErrorCode =
        typeof error === "object" && error && "code" in error
          ? String((error as { code?: unknown }).code ?? "")
          : "";

      console.error(`${provider} Login failed`, error);

      if (firebaseErrorCode === "auth/unauthorized-domain") {
        const currentHost = window.location.hostname;
        alert(
          `OAuth domain is not authorized in Firebase Auth. Add "${currentHost}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`,
        );
        return;
      }

      alert(`${provider} login failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleOAuthLogin,
  };
}
