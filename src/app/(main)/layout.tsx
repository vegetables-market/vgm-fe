import React from 'react';
import MainLayoutClient from '@/components/layouts/MainLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 完全静的サイト: localStorageのみを使用
  // クライアント側で判定（初回はチラつきあり、2回目以降はlocalStorageで高速化）
  return (
    <MainLayoutClient
      initialDeviceType={undefined}
      initialIsPWA={false}
    >
      {children}
    </MainLayoutClient>
  );
}
