import { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harvest Market',
    short_name: 'Harvest',
    description: '旬を、手渡す。生産者とつながるマルシェアプリ',
    lang: 'ja',
    id: '/',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f9f8f4',
    theme_color: '#166534',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any', // any と maskable を分けるケースも多いですが、現状でも動作はします
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['shopping', 'food'],
    // ストアアプリ風UI、screenshotsプロパティ....
  }
}