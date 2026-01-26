"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
    children: React.ReactNode;
    fallback?: React.ReactNode;
};

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // 未ログインの場合、ログインページにリダイレクト
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // ローディング中
    if (isLoading) {
        return fallback || (
            <div className="flex h-screen w-screen items-center justify-center bg-black">
                <div className="text-white">読み込み中...</div>
            </div>
        );
    }

    // 未認証の場合は何も表示しない（リダイレクト中）
    if (!isAuthenticated) {
        return null;
    }

    // 認証済みの場合は子コンポーネントを表示
    return <>{children}</>;
}
