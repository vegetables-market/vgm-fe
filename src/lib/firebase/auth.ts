import type { FirebaseError } from "firebase/app";
import type { AuthCredential, UserCredential } from "firebase/auth";
import { getFirebaseAuth } from "./config";

export type OAuthProviderId = "google" | "microsoft" | "github";
export type SerializedCredential = Record<string, unknown> | null;

function serializeCredential(
  credential: AuthCredential | null,
): SerializedCredential {
  if (!credential) return null;

  const maybeSerializable = credential as AuthCredential & {
    toJSON?: () => unknown;
  };

  if (typeof maybeSerializable.toJSON !== "function") {
    return null;
  }

  const json = maybeSerializable.toJSON();
  return json && typeof json === "object"
    ? (json as Record<string, unknown>)
    : null;
}

export class OAuthAccountExistsError extends Error {
  readonly code = "auth/account-exists-with-different-credential";
  readonly pendingCredentialJson: SerializedCredential;

  constructor(
    public readonly provider: OAuthProviderId,
    public readonly email: string | null,
    public readonly pendingCredential: AuthCredential | null,
    public readonly originalError: unknown,
  ) {
    super(`Account already exists with a different credential (${provider}).`);
    this.name = "OAuthAccountExistsError";
    this.pendingCredentialJson = serializeCredential(pendingCredential);
  }
}

function getFirebaseErrorCode(error: unknown): string {
  if (typeof error === "object" && error && "code" in error) {
    return String((error as { code?: unknown }).code ?? "");
  }
  return "";
}

function getFirebaseErrorEmail(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error &&
    "customData" in error &&
    typeof (error as { customData?: unknown }).customData === "object" &&
    (error as { customData?: { email?: unknown } }).customData
  ) {
    const email = (error as { customData: { email?: unknown } }).customData.email;
    return typeof email === "string" ? email : null;
  }

  if (typeof error === "object" && error && "email" in error) {
    const email = (error as { email?: unknown }).email;
    return typeof email === "string" ? email : null;
  }

  return null;
}

function throwAccountExistsError(
  provider: OAuthProviderId,
  error: unknown,
  pendingCredential: AuthCredential | null,
): never {
  const email = getFirebaseErrorEmail(error);
  throw new OAuthAccountExistsError(provider, email, pendingCredential, error);
}

export async function restoreOAuthCredential(
  _provider: OAuthProviderId,
  credentialJson: SerializedCredential,
): Promise<AuthCredential | null> {
  if (!credentialJson) return null;

  try {
    const { OAuthProvider } = await import("firebase/auth");
    return OAuthProvider.credentialFromJSON(credentialJson);
  } catch (error) {
    console.warn("Failed to restore OAuth credential from JSON", error);
    return null;
  }
}

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
    const { GoogleAuthProvider } = await import("firebase/auth");
    if (getFirebaseErrorCode(error) === "auth/account-exists-with-different-credential") {
      const firebaseError = error as FirebaseError;
      throwAccountExistsError(
        "google",
        error,
        GoogleAuthProvider.credentialFromError(firebaseError),
      );
    }
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
    const { OAuthProvider } = await import("firebase/auth");
    if (getFirebaseErrorCode(error) === "auth/account-exists-with-different-credential") {
      const firebaseError = error as FirebaseError;
      throwAccountExistsError(
        "microsoft",
        error,
        OAuthProvider.credentialFromError(firebaseError),
      );
    }
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
    const { GithubAuthProvider } = await import("firebase/auth");
    if (getFirebaseErrorCode(error) === "auth/account-exists-with-different-credential") {
      const firebaseError = error as FirebaseError;
      throwAccountExistsError(
        "github",
        error,
        GithubAuthProvider.credentialFromError(firebaseError),
      );
    }
    console.error("Error signing in with GitHub", error);
    throw error;
  }
};
