import React from 'react';
import { cookies } from 'next/headers';
import MainLayoutClient from './MainLayoutClient';
import { DeviceType } from '@/hooks/useDevice';


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 静的エクスポート時: このコードは実行されず、initialは常にundefined/falseになる
  // Docker/SSR環境時: 2回目以降の訪問でCookieから読み取り、初回レンダリングでチラつきを防ぐ
  let initialDeviceType: DeviceType | undefined = undefined;
  let initialIsPWA = false;

  try {
    const cookieStore = await cookies();
    const deviceTypeCookie = cookieStore.get('device_type');
    const isPWACookie = cookieStore.get('is_pwa');

    if (deviceTypeCookie) {
      const val = deviceTypeCookie.value;
      if (val === 'mobile' || val === 'tablet' || val === 'desktop') {
        initialDeviceType = val;
      }
    }

    if (isPWACookie) {
      initialIsPWA = isPWACookie.value === 'true';
    }
  } catch (error) {
    // 静的エクスポート環境では cookies() が使えないため、エラーをキャッチ
    // クライアント側でlocalStorageから読み取る
  }

  return (
    <MainLayoutClient
      initialDeviceType={initialDeviceType}
      initialIsPWA={initialIsPWA}
    >
      {children}
    </MainLayoutClient>
  );
}
