"use client";

import Image from "next/image";

interface SocialProvider {
  id: string;
  name: string;
  logo: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: "google",
    name: "Google",
    logo: "/serviceLogo/logo-google.svg",
    bgColor: "bg-white",
    textColor: "text-black",
    borderColor: "border-zinc-400",
  },
];

interface SocialLoginButtonsProps {
  mode: "login" | "signup";
  onProviderClick?: (providerId: string) => void;
}

export default function SocialLoginButtons({
  mode,
  onProviderClick,
}: SocialLoginButtonsProps) {
  const actionText = mode === "login" ? "でログイン" : "で登録";

  return (
    <div className="mb-4 flex w-full flex-col gap-2">
      {SOCIAL_PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          onClick={() => onProviderClick?.(provider.id)}
          className={`relative flex h-12 w-full cursor-pointer items-center justify-center rounded-full border ${provider.borderColor} ${provider.bgColor} font-bold ${provider.textColor} transition-opacity hover:opacity-90`}
        >
          <div className="absolute left-8">
            <div className="relative mr-2 flex h-6 w-6 items-center justify-center">
              {/*{provider.id === "spotify" && (*/}
              {/*  <div className="absolute h-5 w-5 rounded-full bg-black"></div>*/}
              {/*)}*/}
              <Image
                src={provider.logo}
                alt={provider.name}
                width={20}
                height={20}
                className="h-full w-full object-contain"
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
