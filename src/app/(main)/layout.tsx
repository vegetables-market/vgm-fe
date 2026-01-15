import React from 'react';
import { cookies } from 'next/headers';
import MainLayoutClient from './MainLayoutClient';
import { DeviceType } from '@/hooks/useDevice';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const deviceTypeCookie = cookieStore.get('device_type');
  const isPWACookie = cookieStore.get('is_pwa');

  let initialDeviceType: DeviceType | undefined = undefined;
  if (deviceTypeCookie) {
    const val = deviceTypeCookie.value;
    if (val === 'mobile' || val === 'tablet' || val === 'desktop') {
      initialDeviceType = val;
    }
  }

  let initialIsPWA = false;
  if (isPWACookie) {
    initialIsPWA = isPWACookie.value === 'true';
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
