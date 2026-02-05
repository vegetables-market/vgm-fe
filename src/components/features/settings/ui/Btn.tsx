import Link from "next/link";
import React from "react";

interface BtnProps {
  children: React.ReactNode;
  href?: string;
}

export default function Btn({ children, href = "#" }: BtnProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start rounded bg-white px-4 py-3 first:rounded-t-2xl last:rounded-b-2xl"
    >
      {children}
    </Link>
  );
}
