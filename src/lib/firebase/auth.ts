import type { UserCredential } from "firebase/auth";
import { getFirebaseAuth } from "./config";

export const loginWithGoogle = async (): Promise<string> => {
  try {
    const { GoogleAuthProvider, signInWithPopup } =
      await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result: UserCredential = await signInWithPopup(
      getFirebaseAuth(),
      provider,
    );

    const token = await result.user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const loginWithMicrosoft = async (): Promise<string> => {
  try {
    const { OAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new OAuthProvider("microsoft.com");
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const result: UserCredential = await signInWithPopup(
      getFirebaseAuth(),
      provider,
    );
    const token = await result.user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error signing in with Microsoft", error);
    throw error;
  }
};

export const loginWithGithub = async (): Promise<string> => {
  try {
    const { GithubAuthProvider, signInWithPopup } =
      await import("firebase/auth");
    const provider = new GithubAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const result: UserCredential = await signInWithPopup(
      getFirebaseAuth(),
      provider,
    );
    const token = await result.user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error signing in with GitHub", error);
    throw error;
  }
};
