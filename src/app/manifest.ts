import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Einfach Hausen',
    short_name: 'Einfach Hausen',
    description: 'Ein Ansprechpartner für alles rund ums Eigenheim.',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    background_color: '#F7F8F7',
    theme_color: '#176B45',
    lang: 'de-DE',
    categories: ['lifestyle', 'business', 'utilities'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Hausmeister',
        short_name: 'Hausmeister',
        description: 'Ein Anliegen rund ums Haus beschreiben.',
        url: '/app/hausmeister',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Mein Haus',
        short_name: 'Mein Haus',
        description: 'Hausakte, Historie und Wartung öffnen.',
        url: '/app/home',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Nachrichten',
        short_name: 'Nachrichten',
        description: 'Nachrichten und Ansprechpartner öffnen.',
        url: '/app/messages',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
