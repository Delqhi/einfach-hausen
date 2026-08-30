const CACHE = 'einfach-hausen-public-shell-v4';
const PUBLIC_SHELL = [
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
];
const PUBLIC_SHELL_SET = new Set(PUBLIC_SHELL);

function offlineResponse() {
  return new Response(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#105258">
  <title>Einfach Hausen – offline</title>
  <style>
    *{box-sizing:border-box}body{font-family:var(--font-marketing),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#F4F7F7;color:#1C2129;display:grid;min-height:100vh;place-items:center;padding:24px}.box{width:min(100%,480px);background:#fff;border:1px solid #E2E8E8;border-radius:20px;padding:28px}h1{font-size:32px;line-height:1.08;letter-spacing:-.035em;margin:0 0 14px}p{line-height:1.6;color:#57686B;margin:0 0 20px}button{min-height:46px;border:0;border-radius:12px;padding:0 18px;background:#105258;color:white;font:inherit;font-weight:700;cursor:pointer}button:focus-visible{outline:3px solid #9fcfd2;outline-offset:3px}
  </style>
</head>
<body>
  <main class="box">
    <h1>Gerade keine Verbindung.</h1>
    <p>Private App-Seiten, Nachrichten, Dokumente und Medien werden nicht als Offline-Kopie gespeichert. Sobald die Verbindung zurück ist, kannst du die Seite neu laden und sicher weitermachen.</p>
    <button type="button" onclick="location.reload()">Verbindung erneut prüfen</button>
  </main>
</body>
</html>`, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PUBLIC_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (PUBLIC_SHELL_SET.has(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((cached) => cached || fetch(request))
        .catch(() => offlineResponse()),
    );
    return;
  }

  // Authenticated HTML, API responses, messages, documents and media are
  // always network-only. Navigation gets only a generated recovery page when
  // the network itself is unavailable; no private response is written to CacheStorage.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => offlineResponse()));
  }
});
