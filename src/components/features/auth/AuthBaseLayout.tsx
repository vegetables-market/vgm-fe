import React from "react";

interface AuthBaseLayoutProps {
  children: React.ReactNode;
}

export default function AuthBaseLayout({ children }: AuthBaseLayoutProps) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="bg-muted flex w-125 flex-col items-center rounded-2xl pt-8 pb-12">
        {children}
      </div>
    </div>
  );
}
