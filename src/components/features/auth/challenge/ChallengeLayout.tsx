"use client";

import React from "react";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";

type ChallengeLayoutProps = {
  title: string;
  error?: string | null;
  footer?: React.ReactNode;
  children?: React.ReactNode;
};

export default function ChallengeLayout({
  title,
  error,
  footer,
  children,
}: ChallengeLayoutProps) {
  return (
    <div className="flex w-75 flex-col items-center">
      <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold text-white">
        {title}
      </h2>

      {error && <AuthStatusMessage message={error} variant="error" className="mb-4" />}

      {children}

      {footer && (
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-4">
          {footer}
        </div>
      )}
    </div>
  );
}

