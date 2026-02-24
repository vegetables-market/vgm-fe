"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useFirebaseOAuthLogin } from "@/hooks/auth/firebase/useFirebaseOAuthLogin";

interface SocialProvider {
  id: "google" | "microsoft" | "github";
  name: string;
  logoSrc: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: "google",
    name: "Google",
    logoSrc: "/serviceLogo/logo-google.svg",
    bgColor: "bg-background",
    textColor: "",
    borderColor: "border-foreground",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logoSrc: "/serviceLogo/logo-microsoft.svg",
    bgColor: "bg-background",
    textColor: "",
    borderColor: "border-foreground",
  },
  {
    id: "github",
    name: "GitHub",
    logoSrc: "/serviceLogo/logo-github.svg",
    bgColor: "bg-[#010409]",
    textColor: "text-white",
    borderColor: "border-foreground",
  },
];

interface SocialLoginButtonsProps {
  mode: "login" | "signup";
  autoProvider?: "google" | "microsoft" | "github";
  onProviderClick?: (providerId: string) => void;
}

function getMethodLabel(method: string): string {
  switch (method) {
    case "google.com":
      return "Google";
    case "github.com":
      return "GitHub";
    case "microsoft.com":
      return "Microsoft";
    case "password":
      return "Email/Password";
    default:
      return method;
  }
}

export default function AuthSocialButtons({
  mode,
  autoProvider,
  onProviderClick,
}: SocialLoginButtonsProps) {
  const actionText = mode === "login" ? "でログイン" : "で登録";
  const { handleOAuthLogin, loading, accountExistsConflict } =
    useFirebaseOAuthLogin();
  const hasAutoStartedRef = useRef(false);

  const handleProviderClick = useCallback(
    (providerId: "google" | "microsoft" | "github") => {
      handleOAuthLogin(providerId);
      onProviderClick?.(providerId);
    },
    [handleOAuthLogin, onProviderClick],
  );

  useEffect(() => {
    if (mode !== "login" || !autoProvider || hasAutoStartedRef.current) return;
    hasAutoStartedRef.current = true;
    handleProviderClick(autoProvider);
  }, [autoProvider, mode, handleProviderClick]);

  return (
    <div className="mb-4 flex w-full flex-col gap-2">
      {SOCIAL_PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          onClick={() => handleProviderClick(provider.id)}
          disabled={loading}
          className={`relative flex h-12 w-full cursor-pointer items-center justify-center rounded-full border ${provider.borderColor} ${provider.bgColor} font-bold ${provider.textColor} transition-opacity hover:opacity-90 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <div className="absolute left-8">
            <div className="relative mr-2 flex h-6 w-6 items-center justify-center">
              <Image
                src={provider.logoSrc}
                alt={`${provider.name} logo`}
                width={20}
                height={20}
              />
            </div>
          </div>
          <span className="text-sm">
            {provider.name}
            {actionText}
          </span>
        </button>
      ))}
      {accountExistsConflict && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <p>
            This email is already registered with a different sign-in method.
          </p>
          {accountExistsConflict.email && (
            <p className="mt-1">Email: {accountExistsConflict.email}</p>
          )}
          {accountExistsConflict.existingMethods.length > 0 && (
            <p className="mt-1">
              Existing methods:{" "}
              {accountExistsConflict.existingMethods
                .map(getMethodLabel)
                .join(", ")}
            </p>
          )}
          <p className="mt-1">
            Sign in with an existing method first, then link this provider.
          </p>
        </div>
      )}
    </div>
  );
}
