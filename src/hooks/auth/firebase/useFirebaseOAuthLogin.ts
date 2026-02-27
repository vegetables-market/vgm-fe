import {useEffect, useState} from "react";
import {
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithGithub,
    OAuthAccountExistsError,
    restoreOAuthCredential,
    type SerializedCredential,
    type OAuthProviderId,
} from "@/lib/firebase/auth";
import {fetchApi} from "@/lib/api/fetch";
import {API_ENDPOINTS} from "@/lib/api/api-endpoint";
import {useAuth} from "@/context/AuthContext";
import {safeRedirectTo} from "@/lib/next/safeRedirectTo";
import {getFirebaseAuth} from "@/lib/firebase/config";

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

const ACCOUNT_EXISTS_CONFLICT_STORAGE_KEY = "oauth_account_exists_conflict";

type AccountExistsConflict = {
    provider: OAuthProviderId;
    email: string | null;
    existingMethods: string[];
    pendingCredentialJson: SerializedCredential;
};

function loadStoredAccountConflict(): AccountExistsConflict | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = sessionStorage.getItem(ACCOUNT_EXISTS_CONFLICT_STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as Partial<AccountExistsConflict> | null;
        if (!parsed || typeof parsed !== "object") return null;

        if (
            parsed.provider !== "google" &&
            parsed.provider !== "microsoft" &&
            parsed.provider !== "github"
        ) {
            return null;
        }

        return {
            provider: parsed.provider,
            email: typeof parsed.email === "string" ? parsed.email : null,
            existingMethods: Array.isArray(parsed.existingMethods)
                ? parsed.existingMethods.filter(
                    (method): method is string => typeof method === "string",
                )
                : [],
            pendingCredentialJson:
                parsed.pendingCredentialJson &&
                typeof parsed.pendingCredentialJson === "object"
                    ? (parsed.pendingCredentialJson as Record<string, unknown>)
                    : null,
        };
    } catch (error) {
        console.warn("Failed to load OAuth account conflict from session storage", error);
        return null;
    }
}

function saveStoredAccountConflict(conflict: AccountExistsConflict | null) {
    if (typeof window === "undefined") return;

    try {
        if (!conflict) {
            sessionStorage.removeItem(ACCOUNT_EXISTS_CONFLICT_STORAGE_KEY);
            return;
        }

        sessionStorage.setItem(
            ACCOUNT_EXISTS_CONFLICT_STORAGE_KEY,
            JSON.stringify(conflict),
        );
    } catch (error) {
        console.warn("Failed to save OAuth account conflict to session storage", error);
    }
}

function providerToSignInMethod(provider: OAuthProviderId): string {
    switch (provider) {
        case "google":
            return "google.com";
        case "github":
            return "github.com";
        case "microsoft":
            return "microsoft.com";
    }
}

export function useFirebaseOAuthLogin() {
    const [loading, setLoading] = useState(false);
    const [accountExistsConflict, setAccountExistsConflict] =
        useState<AccountExistsConflict | null>(null);
    const {login} = useAuth();

    useEffect(() => {
        const stored = loadStoredAccountConflict();
        if (stored) {
            setAccountExistsConflict(stored);
        }
    }, []);

    const handleOAuthLogin = async (
        provider: "google" | "microsoft" | "github",
    ) => {
        const activeConflict = accountExistsConflict;
        setLoading(true);
        setAccountExistsConflict(null);
        saveStoredAccountConflict(null);

        try {
            let token = "";
            let endpoint = "";

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

            if (
                activeConflict &&
                activeConflict.pendingCredentialJson &&
                activeConflict.existingMethods.includes(
                    providerToSignInMethod(provider),
                )
            ) {
                const pendingCredential = await restoreOAuthCredential(
                    activeConflict.provider,
                    activeConflict.pendingCredentialJson,
                );

                if (pendingCredential) {
                    const {linkWithCredential} = await import("firebase/auth");
                    const currentUser = getFirebaseAuth().currentUser;

                    if (currentUser) {
                        try {
                            await linkWithCredential(currentUser, pendingCredential);
                        } catch (linkError) {
                            const linkErrorCode =
                                typeof linkError === "object" &&
                                    linkError &&
                                    "code" in linkError
                                    ? String((linkError as { code?: unknown }).code ?? "")
                                    : "";

                            const ignorableCodes = [
                                "auth/provider-already-linked",
                                "auth/credential-already-in-use",
                            ];

                            if (!ignorableCodes.includes(linkErrorCode)) {
                                throw linkError;
                            }
                        }
                    } else {
                        console.warn("No current Firebase user found after OAuth sign-in");
                    }
                }
            }

            const response = await fetchApi<ApiLoginResponse>(endpoint, {
                method: "POST",
                body: JSON.stringify({token}),
            });

            if (
                response &&
                response.status === "OAUTH_REGISTRATION_REQUIRED" &&
                response.oauth_token
            ) {
                const params = new URLSearchParams();
                params.set("email", response.user?.email || "");
                params.set("name", response.user?.display_name || "");
                params.set("use_oauth_session", "true");

                try {
                    sessionStorage.setItem("signup_oauth_token", response.oauth_token);
                    sessionStorage.setItem(
                        "signup_oauth_provider",
                        response.oauth_provider || "",
                    );
                } catch (e) {
                    console.warn("Session storage failed", e);
                }

                const redirect = `${safeRedirectTo("/signup")}?${params.toString()}`;
                window.location.href = redirect;
                return;
            }

            if (response && response.status === "AUTHENTICATED" && response.user) {
                saveStoredAccountConflict(null);

                login({
                    username: response.user.username,
                    displayName: response.user.display_name,
                    email: response.user.email,
                    avatarUrl: response.user.avatar_url,
                    isEmailVerified: response.user.is_email_verified,
                });

                const urlParams = new URLSearchParams(window.location.search);
                const rawRedirect =
                    urlParams.get("redirect_to") || urlParams.get("redirect");
                window.location.href = safeRedirectTo(rawRedirect) || "/";
            } else {
                throw new Error(response?.message || "Login failed.");
            }
        } catch (error) {
            if (error instanceof OAuthAccountExistsError) {
                let existingMethods: string[] = [];
                if (error.email) {
                    try {
                        const {fetchSignInMethodsForEmail} = await import("firebase/auth");
                        existingMethods = await fetchSignInMethodsForEmail(
                            getFirebaseAuth(),
                            error.email,
                        );
                    } catch (methodError) {
                        console.warn("Failed to fetch sign-in methods for email", methodError);
                    }
                }

                const conflict: AccountExistsConflict = {
                    provider: error.provider,
                    email: error.email,
                    existingMethods,
                    pendingCredentialJson: error.pendingCredentialJson,
                };

                setAccountExistsConflict(conflict);
                saveStoredAccountConflict(conflict);

                const emailPart = error.email ? ` (${error.email})` : "";
                const methodsPart =
                    existingMethods.length > 0
                        ? ` Existing methods: ${existingMethods.join(", ")}.`
                        : "";
                alert(
                    `This account already exists with a different login method${emailPart}.${methodsPart} Please sign in with your existing provider first, then link this provider.`,
                );
                return;
            }

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
        accountExistsConflict,
        handleOAuthLogin,
    };
}
