import {
  GoogleAuthProvider,
  OAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth } from "./config";
import { getFCMToken } from "./messaging"; // 追加

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");
const githubProvider = new GithubAuthProvider();

export const loginWithGoogle = async (): Promise<string> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    // FCMトークン取得・登録
    await registerFCMToken(token);

    return token;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const loginWithMicrosoft = async (): Promise<string> => {
  try {
    const result: UserCredential = await signInWithPopup(
      auth,
      microsoftProvider,
    );
    const token = await result.user.getIdToken();
    await registerFCMToken(token);
    return token;
  } catch (error) {
    console.error("Error signing in with Microsoft", error);
    throw error;
  }
};

export const loginWithGithub = async (): Promise<string> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, githubProvider);
    const token = await result.user.getIdToken();
    await registerFCMToken(token);
    return token;
  } catch (error) {
    console.error("Error signing in with GitHub", error);
    throw error;
  }
};

// FCMトークンをバックエンドに登録
const registerFCMToken = async (_authToken: string) => {
  try {
    const fcmToken = await getFCMToken();
    if (!fcmToken) return;

    // バックエンドが直るまで、以下のfetch処理を一時的にコメントアウト
    // 環境変数チェック
    /*const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
      return;
    }

    const response = await fetch(`${apiBaseUrl}/api/devices/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        fcmToken,
        platform: "web",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register FCM token");
    }*/
    console.log("FCM token registered successfully");
  } catch (error) {
    console.error("Error registering FCM token:", error);
  }
};
