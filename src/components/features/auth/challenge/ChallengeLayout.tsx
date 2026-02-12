"use client";

import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";

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

      {error && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 p-2 text-center text-[11px] text-white">
          <FaCircleExclamation className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      {children}

      {footer && (
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-4">
          {footer}
        </div>
      )}
    </div>
  );
}

