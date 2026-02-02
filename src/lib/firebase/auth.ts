import { 
  GoogleAuthProvider, 
  OAuthProvider,
  GithubAuthProvider,
  signInWithPopup, 
  UserCredential 
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');
const githubProvider = new GithubAuthProvider();


export const loginWithGoogle = async (): Promise<string> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const loginWithMicrosoft = async (): Promise<string> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, microsoftProvider);
    const token = await result.user.getIdToken();
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
    return token;
  } catch (error) {
    console.error("Error signing in with GitHub", error);
    throw error;
  }
};


