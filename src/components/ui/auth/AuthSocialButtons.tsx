"use client";

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
    bgColor: "bg-white",
    textColor: "text-black",
    borderColor: "border-zinc-400",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logoSrc: "/serviceLogo/logo-microsoft.svg",
    bgColor: "bg-white",
    textColor: "text-black",
    borderColor: "border-zinc-400",
  },
  {
    id: "github",
    name: "GitHub",
    logoSrc: "/serviceLogo/logo-github.svg",
    bgColor: "bg-white",
    textColor: "text-black",
    borderColor: "border-zinc-400",
  },
];

interface SocialLoginButtonsProps {
  mode: "login" | "signup";
  onProviderClick?: (providerId: string) => void;
}

export default function AuthSocialButtons({
  mode,
  onProviderClick,
}: SocialLoginButtonsProps) {
  const actionText = mode === "login" ? "でログイン" : "で登録";
  const { handleOAuthLogin, loading } = useFirebaseOAuthLogin();

  const handleProviderClick = (
    providerId: "google" | "microsoft" | "github",
  ) => {
    handleOAuthLogin(providerId);
    onProviderClick?.(providerId);
  };

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
    </div>
  );
}
