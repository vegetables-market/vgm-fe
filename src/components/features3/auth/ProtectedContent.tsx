"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { getRedirectToFromLocation } from "@/lib/next/getRedirectToFromLocation";

type ProtectedContentProps = {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showLoginLink?: boolean;
};

export default function ProtectedContent({
    children,
    fallback,
    showLoginLink = true
}: ProtectedContentProps) {
    const { isAuthenticated } = useAuth();
    const redirectTo = getRedirectToFromLocation();

    if (isAuthenticated) {
        return <>{children}</>;
    }

    // 未ログイン時の表示
    if (fallback) {
        return <>{fallback}</>;
    }

    // デフォルトのfallback
    return (
        <div className="mt-4">
            <p className="text-gray-600 mb-4">
                何もありません
            </p>
            {showLoginLink && (
                <Link href={withRedirectTo("/login", redirectTo)} className="text-blue-500 hover:underline">
                    ログイン →
                </Link>
            )}
        </div>
    );
}
